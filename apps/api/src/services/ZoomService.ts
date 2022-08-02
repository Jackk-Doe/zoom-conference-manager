/* eslint-disable import/no-cycle */
import Event from '../entities/Event';
import Meeting from '../entities/Meeting';
import { axios } from '../loaders/axios';
import { Logger } from '../loaders/logger';
import { assignMeetings } from '../util/publish/assignMeetings';
import MeetingService from './MeetingService';
import ZoomUserService from './ZoomUserService';

export default class ZoomService {
  static async publishEvent(event: Event) {
    const users = await ZoomUserService.getAll();

    const [userMeetings, unassignedMeetings] = assignMeetings(
      users,
      event.meetings
    );

    if (unassignedMeetings.length > 0) {
      Logger.error(`Unable to assign ${unassignedMeetings.length} meetings`);
      return;
    }

    Logger.info(`Assigned meetings`);
    Logger.info(JSON.stringify(userMeetings, null, 2));

    await Promise.all(
      userMeetings.map(async (userMeeting) => {
        await Promise.all(
          userMeeting.meetings.map(async (meeting) => {
            await ZoomService.scheduleMeeting(meeting, userMeeting.email);
          })
        );
      })
    );
  }

  static async unpublishEvent(event: Event) {
    await Promise.all(
      event.meetings.map((meeting) => this.deleteMeeting(meeting))
    );
  }

  static async scheduleMeeting(meeting: Meeting, userEmail: string) {
    const SCHEDULED_MEETING = 2;

    const meetingData = {
      topic: meeting.name,
      schedule_for: userEmail,
      start_time: meeting.startDateTime.toISOString(),
      duration: meeting.duration + 30,
      type: SCHEDULED_MEETING,
    };

    const res = await axios.post<{ id: number }>(
      `/users/${userEmail}/meetings`,
      meetingData
    );

    const zoomId = res.data.id;

    await MeetingService.setZoomId(meeting.ubid, zoomId);
  }

  static async deleteMeeting(meeting: Meeting) {
    if (!meeting.zoomId) {
      Logger.error(`Unable to delete meeting ${meeting.name}`);
      return;
    }

    try {
      await axios.delete(`/meetings/${meeting.zoomId}`);
    } catch (e) {
      Logger.error(`Unable to delete meeting ${meeting.name}`);
    }
  }
}

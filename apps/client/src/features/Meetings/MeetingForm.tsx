import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { MeetingDTO } from '@zoom-conference-manager/api-interfaces';
import { formats } from '@zoom-conference-manager/dates';
import { FieldError, SubmitHandler } from 'react-hook-form';
import {
  Button,
  Stack,
  MenuItem,
  CircularProgress,
  styled,
} from '@mui/material';
import dayjs from 'dayjs';
import TextInput from '../../components/forms/TextInput';
import Select from '../../components/forms/Select';
import DatetimePicker from '../../components/forms/DatetimePicker';
import { IFormInput, useMeetingForm } from './useMeetingForm';
import { usePostMeeting } from './api/postMeeting';

const Form = styled('form')({});

interface Props {
  eventId: string | null;
}

const MeetingForm: FC<Props> = ({ eventId }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    eventNames,
  } = useMeetingForm(eventId);

  const navigate = useNavigate();

  const onPostSuccess = () => {
    // Notification, meeting added
    // Should navigate to /events/:eventId
    const { eventId: finalEventId } = getValues();
    navigate(`/events/${finalEventId}`);
  };

  const onPostError = (error: unknown, variables: MeetingDTO) => {
    // Notification, error
    console.log('An error occurred');
    console.log('Error: ', error);
    console.log('Data: ', variables);
  };

  const { mutate, isLoading } = usePostMeeting(onPostSuccess, onPostError);

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    const meetingData: MeetingDTO = {
      ...data,
      startDateTime: dayjs(data.startDateTime).format(formats.dateTime),
    };

    // console.log(meetingData);
    mutate(meetingData);
  };

  return (
    <Form
      autoComplete='off'
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        width: {
          xs: '100%',
          sm: 400,
        },
      }}
    >
      <Stack spacing={2}>
        <TextInput
          name='ubid'
          label='UBID'
          control={control}
          error={errors.ubid}
        />
        <TextInput
          name='name'
          label='Name'
          control={control}
          error={errors.name}
        />
        <DatetimePicker
          name='startDateTime'
          label='Meeting Date and Time'
          control={control}
          error={errors.startDateTime as FieldError | void}
        />
        <TextInput
          name='duration'
          label='Meeting Duration (minutes)'
          control={control}
          error={errors.duration}
        />
        <Select
          name='eventId'
          label=''
          control={control}
          error={errors.eventId}
          helperText={errors.eventId?.message}
        >
          <MenuItem value='' disabled>
            Select an event...
          </MenuItem>
          {eventNames &&
            eventNames.map((event) => (
              <MenuItem value={event.id} key={event.id}>
                {event.name}
              </MenuItem>
            ))}
        </Select>
        <Button
          type='submit'
          variant='contained'
          disabled={isLoading}
          startIcon={
            isLoading ? <CircularProgress color='inherit' size='16px' /> : null
          }
        >
          {isLoading ? 'Submitting' : 'Create Meeting'}
        </Button>
      </Stack>
    </Form>
  );
};

export default MeetingForm;

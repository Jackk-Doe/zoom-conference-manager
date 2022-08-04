import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from 'react-query';
import { IEvent } from '@zoom-conference-manager/api-interfaces';
import { EventStatus } from '@zoom-conference-manager/types';
import { renderWithRouter, screen, render } from '../../test-utils';
import EventList from './EventsList';
import EventCard from './EventCard';

const MockEventList = () => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <EventList />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Test EventList', () => {
  test('dummy test to avoid errors until code is fixed perhaps in future', () => {
    expect(1).toBeTruthy();
  });
  // general test on cards in list
  // need to look into how to mock react query
  test('Renders a card within the card list', async () => {
    render(<MockEventList />);
    const cardElements = await screen.findAllByText(/Test Event/i);
    expect(cardElements.length).toBeGreaterThan(0);
  });

  // checking individual cards can be rendered
  test('A card can be made with specified props', async () => {
    const event: IEvent = {
      id: '1',
      name: 'Test Event',
      description: 'Test Event Description',
      startDate: '2020-01-01',
      endDate: '2020-01-02',
      status: EventStatus.DRAFT,
      meetings: [],
    };

    renderWithRouter(<EventCard key={0} event={event} />, {});

    const cardName = screen.getByText(/^Test Event$/i);
    const cardDesc = screen.getByText(/Test Event Description/i);
    const startDt = screen.getByText(/2020-01-01/i);
    const endDt = screen.getByText(/2020-01-02/i);

    expect(cardName).toBeTruthy();
    expect(cardDesc).toBeTruthy();
    expect(startDt).toBeTruthy();
    expect(endDt).toBeTruthy();
  });
});

import { render, screen } from '@testing-library/react';
import StatsCard from '../StatsCard';
import { Users } from 'lucide-react';

describe('StatsCard', () => {
  it('renders correctly with given props', () => {
    render(
      <StatsCard
        title="Total Invitados"
        value={100}
        icon={<Users data-testid="users-icon" />}
        color="blue"
      />
    );

    expect(screen.getByText('Total Invitados')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByTestId('users-icon')).toBeInTheDocument();
    expect(screen.getByText('Total Invitados').closest('div')).toHaveClass('bg-blue-500');
  });

  it('applies the correct color class', () => {
    render(
      <StatsCard
        title="Confirmados"
        value={50}
        icon={<Users />}
        color="green"
      />
    );
    expect(screen.getByText('Confirmados').closest('div')).toHaveClass('bg-green-500');
  });
});

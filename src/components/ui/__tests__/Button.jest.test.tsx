import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button Component - Jest Test', () => {
    it('renders button with children text', () => {
        render(<Button>Click me</Button>);

        const button = screen.getByRole('button', { name: /click me/i });
        expect(button).toBeInTheDocument();
    });

    it('applies primary variant by default', () => {
        render(<Button>Primary Button</Button>);

        const button = screen.getByRole('button');
        expect(button).toHaveClass('btn-primary');
    });

    it('applies different variants correctly', () => {
        const { rerender } = render(<Button variant="secondary">Secondary</Button>);
        let button = screen.getByRole('button');
        expect(button).toHaveClass('btn-secondary');

        rerender(<Button variant="danger">Danger</Button>);
        button = screen.getByRole('button');
        expect(button).toHaveClass('btn-danger');

        rerender(<Button variant="success">Success</Button>);
        button = screen.getByRole('button');
        expect(button).toHaveClass('btn-success');
    });

    it('applies different sizes correctly', () => {
        const { rerender } = render(<Button size="sm">Small</Button>);
        let button = screen.getByRole('button');
        expect(button).toHaveClass('py-2', 'px-4', 'text-sm');

        rerender(<Button size="lg">Large</Button>);
        button = screen.getByRole('button');
        expect(button).toHaveClass('py-4', 'px-8', 'text-lg');
    });

    it('handles click events', () => {
        const handleClick = jest.fn();
        render(<Button onClick={handleClick}>Click me</Button>);

        const button = screen.getByRole('button');
        fireEvent.click(button);

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('disables button when disabled prop is true', () => {
        render(<Button disabled>Disabled Button</Button>);

        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
    });

    it('shows loading spinner when isLoading is true', () => {
        render(<Button isLoading>Loading Button</Button>);

        const button = screen.getByRole('button');
        expect(button).toBeDisabled();

        // Check for the Loader2 icon (lucide-react renders as svg)
        const svg = button.querySelector('svg');
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveClass('animate-spin');
    });

    it('does not trigger onClick when disabled', () => {
        const handleClick = jest.fn();
        render(<Button disabled onClick={handleClick}>Disabled</Button>);

        const button = screen.getByRole('button');
        fireEvent.click(button);

        expect(handleClick).not.toHaveBeenCalled();
    });

    it('applies custom className', () => {
        render(<Button className="custom-class">Custom</Button>);

        const button = screen.getByRole('button');
        expect(button).toHaveClass('custom-class');
    });

    it('renders with all base styles', () => {
        render(<Button>Base Styles</Button>);

        const button = screen.getByRole('button');
        expect(button).toHaveClass('font-semibold', 'rounded-xl', 'transition-all');
    });
});

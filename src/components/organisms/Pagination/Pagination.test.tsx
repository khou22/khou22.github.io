import React from 'react';
import { render, screen } from '@testing-library/react';
import { Pagination } from './Pagination';
import '@testing-library/jest-dom';

describe('Pagination Component', () => {
  it('renders correctly with multiple pages', () => {
    render(<Pagination currentPage={2} totalPages={5} baseUrl="/test" />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '1' })).toHaveAttribute('href', '/test');
    expect(screen.getByRole('link', { name: '3' })).toHaveAttribute('href', '/test/page/3');
  });

  it('does not render if totalPages is 1', () => {
    const { container } = render(<Pagination currentPage={1} totalPages={1} baseUrl="/test" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders ellipses when there are many pages', () => {
    render(<Pagination currentPage={5} totalPages={10} baseUrl="/test" />);
    expect(screen.getAllByText('…').length).toBe(2);
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});

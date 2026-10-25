import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AppProviders } from '../app/providers';
import { Navbar } from '../components/layout/Navbar';

describe('Navbar & Account Menu Component', () => {
  it('renders brand logo and public navigation items', () => {
    render(
      <AppProviders>
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      </AppProviders>
    );

    expect(screen.getAllByText(/Find Jobs/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Companies/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Talent Match/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Schedule/i).length).toBeGreaterThan(0);
  });

  it('renders guest authentication actions when not logged in', () => {
    render(
      <AppProviders>
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      </AppProviders>
    );

    expect(screen.getAllByText(/Sign In/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Get Started/i).length).toBeGreaterThan(0);
  });

  it('toggles mobile menu on menu button click', () => {
    render(
      <AppProviders>
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      </AppProviders>
    );

    const menuButton = screen.getByText('Menu');
    expect(menuButton).toBeInTheDocument();

    fireEvent.click(menuButton);
    expect(screen.getByText('Close')).toBeInTheDocument();
  });
});

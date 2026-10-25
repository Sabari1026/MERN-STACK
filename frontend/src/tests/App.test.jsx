import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('HireConnect React Application Startup & Route Rendering', () => {
  it('renders application with HireConnect brand and landing hero', async () => {
    render(<App />);

    // Brand check
    expect(screen.getAllByText(/HireConnect/i).length).toBeGreaterThan(0);

    // Hero headline check
    const heroHeadline = await screen.findByText(/Modern Recruiting Built for High-Growth Tech/i);
    expect(heroHeadline).toBeInTheDocument();

    // CTA buttons check
    expect(screen.getByText(/Find Open Roles/i)).toBeInTheDocument();
    expect(screen.getByText(/Hire Top Engineers/i)).toBeInTheDocument();
  });

  it('renders navigation links and footer', () => {
    render(<App />);

    // Navigation links in desktop or mobile
    expect(screen.getAllByText(/Find Jobs/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Companies/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Talent Match/i).length).toBeGreaterThan(0);

    // Footer copyright check
    expect(screen.getByText(/HireConnect © 2026/i)).toBeInTheDocument();
  });
});

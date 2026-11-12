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
    expect(screen.getByRole('link', { name: /Privacy Policy/i })).toHaveAttribute('href', '/privacy-policy');
  });

  it('renders publicly accessible Privacy Policy page with all required sections without authentication', () => {
    window.history.pushState({}, 'Privacy Policy', '/privacy-policy');
    render(<App />);

    expect(screen.getByRole('heading', { level: 1, name: /Privacy Policy/i })).toBeInTheDocument();
    expect(screen.getAllByText(/1\. Introduction/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/2\. Information We Collect/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/3\. Candidate Information/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/4\. Recruiter & Company Information/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/5\. Job Applications & Recruitment Data/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/6\. Gmail API & Email Notifications/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/7\. How We Use Information/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/8\. Data Security/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/9\. Data Retention/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/10\. Third-Party Services/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/11\. User Rights/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/12\. Contact Information/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Zero Data Selling/i)).toBeInTheDocument();
    expect(screen.getAllByText(/https:\/\/www\.googleapis\.com\/auth\/gmail\.send/i).length).toBeGreaterThan(0);
  });
});

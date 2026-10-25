import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AppProviders } from '../app/providers';
import { SignInPage } from '../pages/SignInPage';
import { SignUpPage } from '../pages/SignUpPage';

describe('Authentication Pages & Form Controls', () => {
  it('renders sign-in page with candidate, recruiter, and admin role switches', () => {
    render(
      <AppProviders>
        <BrowserRouter>
          <SignInPage />
        </BrowserRouter>
      </AppProviders>
    );

    expect(screen.getByRole('button', { name: 'Candidate' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Recruiter' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Admin' })).toBeInTheDocument();

    expect(screen.getByPlaceholderText(/name@company.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Remember this device/i)).toBeInTheDocument();
  });

  it('switches role to Recruiter on sign-up page and renders company fields', () => {
    render(
      <AppProviders>
        <BrowserRouter>
          <SignUpPage />
        </BrowserRouter>
      </AppProviders>
    );

    const recruiterTab = screen.getByRole('button', { name: /I am a Recruiter/i });
    fireEvent.click(recruiterTab);

    expect(screen.getByPlaceholderText(/Beatport, PushPress, Razorpay/i)).toBeInTheDocument();
  });
});

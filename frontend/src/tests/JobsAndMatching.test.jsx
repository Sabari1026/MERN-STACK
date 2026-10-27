import { describe, it, expect, vi, afterEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AppProviders } from '../app/providers';
import { ToastProvider } from '../context/ToastContext';
import { JobCard } from '../components/jobs/JobCard';
import { ApplyModal } from '../components/jobs/ApplyModal';
import * as AuthContext from '../context/AuthContext';

describe('Job Cards & Application Workflows', () => {
  beforeEach(() => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: null,
      profile: null,
      isAuthenticated: false,
      role: 'guest'
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const mockJob = {
    _id: 'job_123',
    title: 'Senior Cloud Architect',
    companyName: 'Apex Cloud Systems',
    workMode: 'remote',
    jobType: 'full_time',
    location: 'Bengaluru, India',
    salaryMin: 3500000,
    salaryMax: 4500000,
    salaryCurrency: 'INR',
    description: 'Lead high-scale Kubernetes microservices architecture and zero-trust security.'
  };

  it('renders JobCard with metadata, salary, and quick action buttons', () => {
    const handleApply = vi.fn();
    const handleSave = vi.fn();

    render(
      <AppProviders>
        <BrowserRouter>
          <JobCard job={mockJob} onApply={handleApply} onToggleSave={handleSave} />
        </BrowserRouter>
      </AppProviders>
    );

    expect(screen.getByText('Senior Cloud Architect')).toBeInTheDocument();
    expect(screen.getByText('Apex Cloud Systems')).toBeInTheDocument();
    expect(screen.getByText('REMOTE')).toBeInTheDocument();
    expect(screen.getByText(/35.*000.*45.*000/i)).toBeInTheDocument();

    const applyBtn = screen.getByRole('button', { name: /Apply/i });
    fireEvent.click(applyBtn);
    expect(handleApply).toHaveBeenCalledWith(mockJob);
  });

  it('renders ApplyModal when open', () => {
    render(
      <ToastProvider>
        <BrowserRouter>
          <ApplyModal job={mockJob} isOpen={true} onClose={() => {}} />
        </BrowserRouter>
      </ToastProvider>
    );

    expect(screen.getByText(/Direct Application/i)).toBeInTheDocument();
    expect(screen.getByText('Senior Cloud Architect')).toBeInTheDocument();
    expect(screen.queryByText(/Screening Questions/i)).not.toBeInTheDocument();
  });

  it('renders screening questions in ApplyModal when job includes them for authenticated candidate', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: { name: 'Aarav Sharma', email: 'aarav@hireconnect.io' },
      profile: { headline: 'Staff Cloud Architect', resume: { filename: 'Aarav_Resume.pdf' } },
      isAuthenticated: true,
      role: 'candidate'
    });

    const jobWithScreening = {
      ...mockJob,
      screeningQuestions: [
        {
          id: 'sq_1',
          question: 'How many years of microservices experience do you have?',
          required: true,
          type: 'text'
        },
        {
          id: 'sq_2',
          question: 'Are you open to hybrid work in Bengaluru?',
          required: false,
          type: 'yes_no'
        }
      ]
    };

    render(
      <ToastProvider>
        <BrowserRouter>
          <ApplyModal job={jobWithScreening} isOpen={true} onClose={() => {}} />
        </BrowserRouter>
      </ToastProvider>
    );

    expect(screen.getByText(/Screening Questions/i)).toBeInTheDocument();
    expect(screen.getByText(/How many years of microservices experience do you have/i)).toBeInTheDocument();
    expect(screen.getByText(/Are you open to hybrid work in Bengaluru/i)).toBeInTheDocument();
    expect(screen.getByText('2 Questions')).toBeInTheDocument();
  });
});

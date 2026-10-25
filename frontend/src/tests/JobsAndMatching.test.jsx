import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AppProviders } from '../app/providers';
import { JobCard } from '../components/jobs/JobCard';
import { ApplyModal } from '../components/jobs/ApplyModal';

describe('Job Cards & Application Workflows', () => {
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
      <AppProviders>
        <BrowserRouter>
          <ApplyModal job={mockJob} isOpen={true} onClose={() => {}} />
        </BrowserRouter>
      </AppProviders>
    );

    expect(screen.getByText(/Direct Application/i)).toBeInTheDocument();
    expect(screen.getByText('Senior Cloud Architect')).toBeInTheDocument();
  });
});

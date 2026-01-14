import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useEntryStore } from '../stores/entryStore';
import { PageLayout } from '../components/PageLayout';
import { NavHeader } from '../components/NavHeader';
import { SlidingCalendar } from '../components/SlidingCalendar';
import { EntryDetail } from '../components/EntryDetail';
import { BackdatedEntryForm } from '../components/BackdatedEntryForm';

type ViewMode = 'view' | 'create' | 'edit';

export const History = () => {
  const { entries, loadEntries, getEntryByDate } = useEntryStore();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [viewMode, setViewMode] = useState<ViewMode>('view');

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const selectedEntry = getEntryByDate(selectedDate);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setViewMode('view');
  };

  const handleCreate = () => {
    setViewMode('create');
  };

  const handleEdit = () => {
    setViewMode('edit');
  };

  const handleFormClose = () => {
    setViewMode('view');
  };

  const handleFormSave = () => {
    setViewMode('view');
    loadEntries();
  };

  return (
    <PageLayout>
      <NavHeader title="History" showBack />

      <main className="page-container pt-2 pb-8 space-y-4">
        <SlidingCalendar
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          entries={entries}
        />

        {viewMode === 'view' ? (
          <EntryDetail
            date={selectedDate}
            entry={selectedEntry}
            onEdit={handleEdit}
            onCreate={handleCreate}
          />
        ) : (
          <BackdatedEntryForm
            date={selectedDate}
            existingEntry={viewMode === 'edit' ? selectedEntry : undefined}
            onClose={handleFormClose}
            onSave={handleFormSave}
          />
        )}
      </main>
    </PageLayout>
  );
};

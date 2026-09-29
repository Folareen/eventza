'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { RiImageAddLine, RiDeleteBin6Line, RiErrorWarningLine } from 'react-icons/ri';
import { cn } from '@/lib/cn';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { COUNTRIES, STATES, EVENT_CATEGORIES } from '@/lib/constants';
import type { Event } from '@/lib/types';

interface EventFormProps {
    initialData?: Event;
    onSubmit: (formData: FormData) => Promise<void>;
    loading?: boolean;
}

const categoryOptions = EVENT_CATEGORIES.map((c) => ({ value: c, label: c }));
const countryOptions = COUNTRIES.map((c) => ({ value: c.name, label: c.name }));

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

/** Groups related fields so a long form reads as a few short ones. */
function FormSection({
    title, description, children,
}: { title: string; description?: string; children: React.ReactNode }) {
    return (
        <section className="grid gap-5 border-b border-line pb-7 last:border-0 last:pb-0 sm:grid-cols-[180px_1fr] sm:gap-8">
            <div>
                <h2 className="text-[13px] font-semibold text-ink">{title}</h2>
                {description && (
                    <p className="mt-1 text-[12px] leading-relaxed text-ink-4">{description}</p>
                )}
            </div>
            <div className="flex flex-col gap-4">{children}</div>
        </section>
    );
}

export function EventForm({ initialData, onSubmit, loading }: EventFormProps) {
    const [title, setTitle] = useState(initialData?.title ?? '');
    const [description, setDescription] = useState(initialData?.description ?? '');
    const [date, setDate] = useState(initialData?.date?.slice(0, 10) ?? '');
    const [time, setTime] = useState(initialData?.time?.slice(0, 5) ?? '');
    const [venue, setVenue] = useState(initialData?.venue ?? '');
    const [country, setCountry] = useState(initialData?.country ?? '');
    const [state, setState] = useState(initialData?.state ?? '');
    const [category, setCategory] = useState(initialData?.category ?? '');
    const [capacity, setCapacity] = useState(String(initialData?.capacity ?? ''));
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>(initialData?.bannerImage ?? '');
    const [dragging, setDragging] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const fileRef = useRef<HTMLInputElement>(null);
    const objectUrlRef = useRef<string | null>(null);

    const countryCode = COUNTRIES.find((c) => c.name === country)?.code ?? '';
    const stateOptions = countryCode
        ? (STATES[countryCode] ?? []).map((s) => ({ value: s, label: s }))
        : [];

    // Drop a stale state when the country changes to one that lacks it.
    useEffect(() => {
        if (country && state && stateOptions.length > 0 && !stateOptions.some((s) => s.value === state)) {
            setState('');
        }
    }, [country]); // eslint-disable-line react-hooks/exhaustive-deps

    // Revoke the preview object URL so the blob isn't leaked.
    useEffect(() => () => {
        if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    }, []);

    const acceptFile = (file: File | undefined) => {
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            setErrors((e) => ({ ...e, bannerImage: 'That file is not an image' }));
            return;
        }
        if (file.size > MAX_IMAGE_BYTES) {
            setErrors((e) => ({ ...e, bannerImage: 'Image must be under 10MB' }));
            return;
        }
        if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
        const url = URL.createObjectURL(file);
        objectUrlRef.current = url;
        setImageFile(file);
        setImagePreview(url);
        setErrors((e) => ({ ...e, bannerImage: '' }));
    };

    const clearImage = () => {
        if (objectUrlRef.current) {
            URL.revokeObjectURL(objectUrlRef.current);
            objectUrlRef.current = null;
        }
        setImageFile(null);
        setImagePreview('');
        if (fileRef.current) fileRef.current.value = '';
    };

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!title.trim()) errs.title = 'Title is required';
        if (!description.trim()) errs.description = 'Description is required';
        if (!date) errs.date = 'Date is required';
        if (!time) errs.time = 'Time is required';
        if (!venue.trim()) errs.venue = 'Venue is required';
        if (!country) errs.country = 'Country is required';
        if (!state) errs.state = 'State is required';
        if (!category) errs.category = 'Category is required';
        if (!capacity || Number.isNaN(Number(capacity)) || Number(capacity) < 1) {
            errs.capacity = 'Enter a positive number';
        }
        if (!imageFile && !imagePreview) errs.bannerImage = 'Banner image is required';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) {
            // Bring the first problem into view rather than failing silently.
            document
                .querySelector('[aria-invalid="true"], [data-field-error]')
                ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }
        const fd = new FormData();
        fd.append('title', title.trim());
        fd.append('description', description.trim());
        fd.append('date', date);
        fd.append('time', time);
        fd.append('venue', venue.trim());
        fd.append('country', country);
        fd.append('state', state);
        fd.append('category', category);
        fd.append('capacity', capacity);
        if (imageFile) fd.append('bannerImage', imageFile);
        else if (imagePreview.startsWith('http')) fd.append('bannerImage', imagePreview);
        await onSubmit(fd);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-7">
            <FormSection title="Basics" description="What the event is and how you'd describe it.">
                <Input
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    error={errors.title}
                    placeholder="Summer Rooftop Sessions"
                    maxLength={120}
                />
                <Textarea
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    error={errors.description}
                    placeholder="What should attendees expect? Include the line-up, what's included, and anything they should bring."
                    rows={5}
                    hint={`${description.length} characters`}
                />
                <Select
                    label="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    error={errors.category}
                    placeholder="Select a category"
                    options={categoryOptions}
                />
            </FormSection>

            <FormSection title="When" description="Date and start time in the venue's local time.">
                <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                        label="Date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        error={errors.date}
                    />
                    <Input
                        label="Start time"
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        error={errors.time}
                    />
                </div>
            </FormSection>

            <FormSection title="Where" description="Attendees see this on the event page.">
                <Input
                    label="Venue"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    error={errors.venue}
                    placeholder="The Roundhouse, 12 Chalk Farm Rd"
                />
                <div className="grid gap-4 sm:grid-cols-2">
                    <Select
                        label="Country"
                        value={country}
                        onChange={(e) => { setCountry(e.target.value); setState(''); }}
                        error={errors.country}
                        placeholder="Select country"
                        options={countryOptions}
                    />
                    <Select
                        label="State / Region"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        error={errors.state}
                        placeholder={country ? 'Select state' : 'Pick a country first'}
                        options={stateOptions}
                        disabled={!country}
                    />
                </div>
                <Input
                    label="Capacity"
                    type="number"
                    min="1"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    error={errors.capacity}
                    placeholder="250"
                    trailing="attendees"
                />
            </FormSection>

            <FormSection title="Banner" description="A wide image, at least 1200×675. Max 10MB.">
                <div className="flex flex-col gap-2">
                    {imagePreview ? (
                        <div className="group relative aspect-[16/9] w-full overflow-hidden rounded-[var(--radius-card)] border border-line">
                            <Image src={imagePreview} alt="Banner preview" fill className="object-cover" sizes="600px" />
                            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-ink/55 opacity-0 backdrop-blur-[2px] transition-opacity duration-200 group-hover:opacity-100">
                                <Button type="button" size="sm" variant="secondary" onClick={() => fileRef.current?.click()}>
                                    Replace
                                </Button>
                                <Button type="button" size="sm" variant="danger" onClick={clearImage}>
                                    <RiDeleteBin6Line className="h-4 w-4" /> Remove
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => fileRef.current?.click()}
                            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                            onDragLeave={() => setDragging(false)}
                            onDrop={(e) => {
                                e.preventDefault();
                                setDragging(false);
                                acceptFile(e.dataTransfer.files?.[0]);
                            }}
                            data-field-error={errors.bannerImage ? '' : undefined}
                            className={cn(
                                'flex aspect-[16/9] w-full cursor-pointer flex-col items-center justify-center gap-2',
                                'rounded-[var(--radius-card)] border-2 border-dashed transition-colors duration-200',
                                dragging
                                    ? 'border-accent bg-accent-soft'
                                    : errors.bannerImage
                                        ? 'border-danger-line bg-danger-soft/40'
                                        : 'border-line-strong bg-surface-2/50 hover:border-ink-4 hover:bg-surface-2',
                            )}
                        >
                            <RiImageAddLine className={cn('h-8 w-8', dragging ? 'text-accent' : 'text-ink-4')} />
                            <p className="text-[13px] font-medium text-ink-2">
                                {dragging ? 'Drop to upload' : 'Click to upload, or drag an image here'}
                            </p>
                            <p className="text-[12px] text-ink-4">PNG or JPG, up to 10MB</p>
                        </button>
                    )}

                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => acceptFile(e.target.files?.[0])}
                    />

                    {errors.bannerImage && (
                        <p className="flex items-center gap-1.5 text-xs text-danger">
                            <RiErrorWarningLine className="h-3.5 w-3.5" /> {errors.bannerImage}
                        </p>
                    )}
                </div>
            </FormSection>

            <div className="sticky bottom-0 -mx-4 flex items-center justify-end gap-3 border-t border-line bg-paper/90 px-4 py-4 backdrop-blur-sm sm:mx-0 sm:rounded-b-[var(--radius-card)] sm:px-0">
                <p className="mr-auto hidden text-[12px] text-ink-4 sm:block">
                    {initialData ? 'Changes go live immediately.' : 'You can add tickets after creating the event.'}
                </p>
                <Button type="submit" loading={loading} size="lg">
                    {initialData ? 'Save changes' : 'Create event'}
                </Button>
            </div>
        </form>
    );
}

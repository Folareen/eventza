'use client';

import { useState, useRef, useEffect } from 'react';
import { RiUploadCloud2Line } from 'react-icons/ri';
import Image from 'next/image';
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

export function EventForm({ initialData, onSubmit, loading }: EventFormProps) {
    const [title, setTitle] = useState(initialData?.title ?? '');
    const [description, setDescription] = useState(initialData?.description ?? '');
    const [date, setDate] = useState(initialData?.date ?? '');
    const [time, setTime] = useState(initialData?.time?.slice(0, 5) ?? '');
    const [venue, setVenue] = useState(initialData?.venue ?? '');
    const [country, setCountry] = useState(initialData?.country ?? '');
    const [state, setState] = useState(initialData?.state ?? '');
    const [category, setCategory] = useState(initialData?.category ?? '');
    const [capacity, setCapacity] = useState(String(initialData?.capacity ?? ''));
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>(initialData?.bannerImage ?? '');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const fileRef = useRef<HTMLInputElement>(null);

    const countryCode = COUNTRIES.find((c) => c.name === country)?.code ?? '';
    const stateOptions = countryCode ? (STATES[countryCode] ?? []).map((s) => ({ value: s, label: s })) : [];

    useEffect(() => {
        if (country && state && stateOptions.length > 0 && !stateOptions.find((s) => s.value === state)) {
            setState('');
        }
    }, [country]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
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
        if (!capacity || isNaN(Number(capacity)) || Number(capacity) < 1) errs.capacity = 'Capacity must be a positive number';
        if (!imageFile && !imagePreview) errs.bannerImage = 'Banner image is required';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        const fd = new FormData();
        fd.append('title', title);
        fd.append('description', description);
        fd.append('date', date);
        fd.append('time', time);
        fd.append('venue', venue);
        fd.append('country', country);
        fd.append('state', state);
        fd.append('category', category);
        fd.append('capacity', capacity);
        if (imageFile) {
            fd.append('bannerImage', imageFile);
        } else if (imagePreview && imagePreview.startsWith('http')) {
            fd.append('bannerImage', imagePreview);
        }
        await onSubmit(fd);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} error={errors.title} placeholder="Event title" />
            <Textarea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} error={errors.description} placeholder="Describe your event..." rows={4} />

            <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} error={errors.date} />
                <Input label="Time" type="time" value={time} onChange={(e) => setTime(e.target.value)} error={errors.time} />
            </div>

            <Input label="Venue" value={venue} onChange={(e) => setVenue(e.target.value)} error={errors.venue} placeholder="Venue name and address" />

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
                    placeholder={country ? 'Select state' : 'Select country first'}
                    options={stateOptions}
                    disabled={!country}
                />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <Select
                    label="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    error={errors.category}
                    placeholder="Select category"
                    options={categoryOptions}
                />
                <Input
                    label="Capacity"
                    type="number"
                    min="1"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    error={errors.capacity}
                    placeholder="Max attendees"
                />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Banner Image</label>
                <div
                    className="relative flex flex-col items-center justify-center rounded border-2 border-dashed border-zinc-300 bg-zinc-50 p-6 cursor-pointer hover:border-zinc-400 transition-colors dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-500"
                    onClick={() => fileRef.current?.click()}
                >
                    {imagePreview ? (
                        <div className="relative w-full aspect-video rounded overflow-hidden">
                            <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                        </div>
                    ) : (
                        <>
                            <RiUploadCloud2Line className="h-8 w-8 text-zinc-400" />
                            <p className="mt-2 text-sm text-zinc-500">Click to upload banner image</p>
                            <p className="text-xs text-zinc-400">PNG, JPG up to 10MB</p>
                        </>
                    )}
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </div>
                {imagePreview && (
                    <button type="button" onClick={() => { setImageFile(null); setImagePreview(''); }} className="self-start text-xs text-red-500 hover:underline mt-1">Remove image</button>
                )}
                {errors.bannerImage && <p className="text-xs text-red-500">{errors.bannerImage}</p>}
            </div>

            <Button type="submit" loading={loading} className="self-start">
                {initialData ? 'Update Event' : 'Create Event'}
            </Button>
        </form>
    );
}

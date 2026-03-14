import React, { useState, useEffect } from 'react';
import { X, User, BookOpen, Heart, AlertCircle, Loader2 } from 'lucide-react';
import { Kid, ClubGroup } from '../types';
import { Backend } from '../services/backend';

interface AddClubberModalProps {
  isOpen: boolean;
  onClose: () => void;
  kid?: Kid | null;
  onSuccess?: () => void;
}

const AddClubberModal: React.FC<AddClubberModalProps> = ({ isOpen, onClose, kid, onSuccess }) => {
  const [awanaSupportValue, setAwanaSupportValue] = useState('No');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get today's date for max attribute validation
  const today = new Date().toISOString().split('T')[0];
  
  const isEditing = !!kid;

  // Derive mock details if editing to make the form look realistic
  const getInitialData = () => {
    if (!kid) return {
        firstName: '', lastName: '', gender: '', dob: '', 
        fatherName: '', motherName: '', phone: '',
        level: 'Cubby'
    };

    // const nameParts = kid.name.split(' ');
    const firstName = kid.firstname.split(' ')[0];
    const lastName = kid.firstname.split(' ').slice(1).join(' ');

    // Generate deterministic mock data based on ID for consistency
    const seed = kid.id.toString().charCodeAt(0) || 0;
    const gender = seed % 2 === 0 ? 'Male' : 'Female';
    const phone = `(555) ${100 + (seed % 900)}-${1000 + (seed * 5 % 9000)}`;
    
    // Estimate DOB based on group
    const currentYear = new Date().getFullYear();
    let age = 10;
    if (kid.group_name === 'Cubby') age = 4;
    else if (kid.group_name === 'Spark') age = 6;
    else if (kid.group_name === 'Flame') age = 9;
    else if (kid.group_name === 'Torch') age = 12;
    
    const dob = `${currentYear - age}-0${(seed % 9) + 1}-15`;

    return {
        firstName, 
        lastName, 
        gender,
        dob,
        fatherName: `Mr. ${lastName}`,
        motherName: `Mrs. ${lastName}`,
        phone,
        level: kid.group_name
    };
  };

  const initialData = getInitialData();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const dob = formData.get('dateOfBirth') as string;

    // Validate DOB
    if (dob && dob > today) {
        alert("Date of Birth cannot be in the future");
        return;
    }

    setIsSubmitting(true);
    
    try {
        // Collect all form data
        const clubberData = {
            firstname: formData.get('firstname') as string,
            middlename: formData.get('middlename') as string,
            lastname: formData.get('lastname') as string,
            dateOfBirth: formData.get('dateOfBirth') as string,
            gender: formData.get('gender') as string,
            country: formData.get('country') as string,
            address: formData.get('address') as string || '',
            level: formData.get('level') as string,
            school: formData.get('school') as string || '',
            educationLevel: formData.get('educationLevel') as string || '',
            awanaSupport: formData.get('awanaSupport') as string,
            supportContact: formData.get('supportContact') as string || '',
            declaration: formData.get('declaration') as string || '',
            fatherName: formData.get('fatherName') as string || '',
            fatherOccupation: formData.get('fatherOccupation') as string || '',
            fatherContact: formData.get('fatherContact') as string || '',
            motherName: formData.get('motherName') as string || '',
            motherOccupation: formData.get('motherOccupation') as string || '',
            motherContact: formData.get('motherContact') as string || '',
            emergencyName: formData.get('emergencyName') as string || '',
            emergencyRelation: formData.get('emergencyRelation') as string || '',
            emergencyContact: formData.get('emergencyContact') as string || '',
            medicalContact: formData.get('medicalContact') as string || '',
            medicalConditions: formData.get('medicalConditions') as string || '',
            allergies: formData.get('allergies') as string || '',
        };

        const result = await Backend.addClubber(clubberData);
        
        if (result.success) {
            alert(result.message);
            if (onSuccess) onSuccess();
            onClose();
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error("Failed to save clubber", error);
        alert("Failed to save clubber. Please try again.");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 dark:border-slate-700 custom-scrollbar flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm z-10 px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {isEditing ? 'Edit Clubber Details' : 'Register New Clubber1'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-slate-400">
                {isEditing ? `Update information for ${kid.name}` : "Enter the child's details below"}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors text-gray-500 dark:text-slate-400"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Form */}
        <form className="p-6 space-y-8" onSubmit={handleSubmit}>
          
          {/* Section 1: Personal Information */}
          <section>
             <h3 className="flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-4 border-b border-gray-100 dark:border-slate-800 pb-2">
                <User size={16} /> Personal Information
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input label="First Name" name="firstname" placeholder="John" defaultValue={initialData.firstName} required />
                <Input label="Middle Name" name="middlename" placeholder="" />
                <Input label="Last Name" name="lastname" placeholder="Doe" defaultValue={initialData.lastName} required />
                
                <Input 
                    label="Date of Birth" 
                    name="dateOfBirth" 
                    type="date" 
                    defaultValue={initialData.dob} 
                    max={today}
                    required
                />
                <Select label="Gender" name="gender" defaultValue={initialData.gender || "Select..."}>
                    <option disabled>Select...</option>
                    <option>Male</option>
                    <option>Female</option>
                </Select>
                <Input label="Country" name="country" placeholder="USA" defaultValue={isEditing ? "USA" : ""} />
                
                <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Address</label>
                    <textarea 
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" 
                        rows={2}
                        name="address"
                        defaultValue={isEditing ? "123 Maple Street, Springfield" : ""}
                    ></textarea>
                </div>
             </div>
          </section>

          {/* Section 2: Academic & Club Details */}
          <section>
             <h3 className="flex items-center gap-2 text-sm font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-4 border-b border-gray-100 dark:border-slate-800 pb-2">
                <BookOpen size={16} /> Academic & Club Details
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select label="Awana Level" name="level" defaultValue={initialData.level}>
                    <option>Cubby</option>
                    <option>Spark</option>
                    <option>Flame</option>
                    <option>Torch</option>
                </Select>
                <Input label="School Name" name="school" placeholder="Elementary School" defaultValue={isEditing ? "Lincoln Elementary" : ""} />
                <Input label="Education Level" name="educationLevel" placeholder="Grade 2" defaultValue={isEditing ? "Grade " + (new Date().getFullYear() - parseInt(initialData.dob.split('-')[0]) - 5) : ""} />
                
                <Select 
                    label="Awana Support?" 
                    name="awanaSupport" 
                    value={awanaSupportValue}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setAwanaSupportValue(e.target.value)}
                >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                </Select>
                
                {awanaSupportValue === 'Yes' && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                        <Input label="Support Contact" name="supportContact" placeholder="Name/Phone" />
                    </div>
                )}
                
                <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Declaration</label>
                    <textarea className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" rows={2} name="declaration" placeholder="Any special declarations..."></textarea>
                </div>
             </div>
          </section>

          {/* Section 3: Family Information */}
          <section>
             <h3 className="flex items-center gap-2 text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-4 border-b border-gray-100 dark:border-slate-800 pb-2">
                <Heart size={16} /> Family Information
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Input label="Father's Name" name="fatherName" defaultValue={initialData.fatherName} />
                <Input label="Occupation" name="fatherOccupation" defaultValue={isEditing ? "Engineer" : ""} />
                <Input label="Contact Number" name="fatherContact" defaultValue={initialData.phone} />
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input label="Mother's Name" name="motherName" defaultValue={initialData.motherName} />
                <Input label="Occupation" name="motherOccupation" defaultValue={isEditing ? "Teacher" : ""} />
                <Input label="Contact Number" name="motherContact" defaultValue={initialData.phone} />
             </div>
          </section>

          {/* Section 4: Emergency & Medical */}
          <section>
             <h3 className="flex items-center gap-2 text-sm font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-4 border-b border-gray-100 dark:border-slate-800 pb-2">
                <AlertCircle size={16} /> Emergency & Medical
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Input label="Emergency Contact Name" name="emergencyName" defaultValue={initialData.fatherName} />
                <Input label="Relationship" name="emergencyRelation" defaultValue={isEditing ? "Father" : ""} />
                <Input label="Phone Number" name="emergencyContact" defaultValue={initialData.phone} />
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <Input label="Medical Contact" name="medicalContact" placeholder="Doctor Name/Phone" defaultValue={isEditing ? "Dr. Smith (555-9999)" : ""} />
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Medical Conditions</label>
                    <textarea 
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" 
                        rows={2}
                        name="medicalConditions"
                        defaultValue={isEditing ? "None" : ""}
                    ></textarea>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Allergies</label>
                    <textarea 
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" 
                        rows={2}
                        name="allergies"
                        defaultValue={isEditing ? "Peanuts" : ""}
                    ></textarea>
                </div>
             </div>
          </section>

          {/* Footer Actions */}
          <div className="sticky bottom-0 -mx-6 -mb-6 p-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-t border-gray-100 dark:border-slate-800 flex justify-end gap-3 z-10 rounded-b-2xl">
             <button type="button" onClick={onClose} disabled={isSubmitting} className="px-6 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50">
                Cancel
             </button>
             <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all disabled:opacity-70 flex items-center gap-2">
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isEditing ? 'Update Clubber' : 'Save Registration'}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    [key: string]: any;
}

const Input = ({ label, ...props }: InputProps) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{label}</label>
        <input 
            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder-gray-400 dark:placeholder-slate-600"
            {...props}
        />
    </div>
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    children?: React.ReactNode;
    [key: string]: any;
}

const Select = ({ label, children, ...props }: SelectProps) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{label}</label>
        <div className="relative">
            <select 
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none"
                {...props}
            >
                {children}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-slate-400">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
        </div>
    </div>
);

export default AddClubberModal;
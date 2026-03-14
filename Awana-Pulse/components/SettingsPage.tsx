import React, { useState } from 'react';
import { User, Bell, Shield, Moon, LogOut, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Input, Label, Separator, Switch } from './ui';

interface SettingsPageProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  onLogout: () => void;
}

const ChangePasswordModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 dark:border-slate-700 p-6 animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Change Password</h2>
                  <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                      <X size={20} />
                  </button>
              </div>
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
                  <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" placeholder="••••••••" />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" placeholder="••••••••" />
                  </div>
                   <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input id="confirm-password" type="password" placeholder="••••••••" />
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                      <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
                      <Button type="submit">Update Password</Button>
                  </div>
              </form>
          </div>
      </div>
    )
}

const SettingsPage: React.FC<SettingsPageProps> = ({ isDarkMode, toggleTheme, onLogout }) => {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <CardTitle>Profile Information</CardTitle>
          </div>
          <CardDescription>Update your personal details and public profile.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
             <img src="https://picsum.photos/100/100?random=99" alt="Avatar" className="w-16 h-16 rounded-full border-2 border-border" />
             <Button variant="outline">Change Avatar</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>First Name</Label>
              <Input defaultValue="Sarah" />
            </div>
            <div className="space-y-1">
              <Label>Last Name</Label>
              <Input defaultValue="Miller" />
            </div>
            <div className="space-y-1">
              <Label>Email</Label>
              <Input defaultValue="sarah.miller@example.com" type="email" />
            </div>
            <div className="space-y-1">
              <Label>Role</Label>
              <Input defaultValue="Awana Director" disabled className="bg-muted text-muted-foreground" />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
             <Moon className="h-5 w-5 text-primary" />
             <CardTitle>Appearance</CardTitle>
          </div>
          <CardDescription>Customize how the dashboard looks on your device.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">Enable dark mode for better viewing at night.</p>
            </div>
            <Switch checked={isDarkMode} onCheckedChange={toggleTheme} />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <CardTitle>Notifications</CardTitle>
          </div>
          <CardDescription>Configure how you receive alerts.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Email Alerts</Label>
              <p className="text-sm text-muted-foreground">Receive daily summaries via email.</p>
            </div>
            <Switch 
                checked={emailNotifications} 
                onCheckedChange={setEmailNotifications} 
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">SMS Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive text messages on your phone.</p>
            </div>
            <Switch 
                checked={smsNotifications} 
                onCheckedChange={setSmsNotifications} 
            />
          </div>
        </CardContent>
      </Card>

       {/* Security */}
       <Card className="border-red-100 dark:border-red-900/30">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-500" />
            <CardTitle className="text-red-600 dark:text-red-400">Security Zone</CardTitle>
          </div>
          <CardDescription>Manage password and sessions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => setIsPasswordModalOpen(true)}>
                Change Password
            </Button>
            <Separator />
            <Button variant="destructive" className="w-full sm:w-auto gap-2" onClick={onLogout}>
                <LogOut size={16} /> Sign out of all devices
            </Button>
        </CardContent>
      </Card>

      <ChangePasswordModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} />
    </div>
  );
};

export default SettingsPage;
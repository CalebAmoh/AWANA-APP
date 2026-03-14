import { Kid, ClubGroup, Status } from '../types';
import { MOCK_KIDS } from '../constants';

const STORAGE_KEY = 'awana_pulse_data_v1';
const AUTH_KEY = 'awana_pulse_auth_token';
const DELAY_MS = 300; // Simulate network latency
const API_URL = 'http://localhost:5000/v1/api/awana_pulse'; // Configure your API endpoint here

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class BackendService {
  private getStoredData(): Kid[] {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      // Seed with mock data if empty
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_KIDS));
      return MOCK_KIDS;
    }
    try {
        const parsed = JSON.parse(stored);
        if (!Array.isArray(parsed)) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_KIDS));
            return MOCK_KIDS;
        }
        // Sanitize: ensure all kids have IDs. Filter out corrupted records.
        const validKids = parsed.filter((k: any) => k && typeof k.id === 'string' && k.id.length > 0);
        
        // If we filtered out bad data, update storage to clean it up
        if (validKids.length !== parsed.length) {
            this.setStoredData(validKids);
        }
        
        return validKids;
    } catch (e) {
        console.error("Error parsing stored data", e);
        return MOCK_KIDS;
    }
  }

  private setStoredData(data: Kid[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  // --- API METHODS ---

  async login(email: string, password: string): Promise<boolean> {
      await delay(800);
      // Simple mock authentication
      if (email.toLowerCase() === 'admin@awana.org' && password === 'password') {
          localStorage.setItem(AUTH_KEY, 'mock-jwt-token-xyz-123');
          return true;
      }
      return false;
  }

  async logout(): Promise<void> {
      await delay(200);
      localStorage.removeItem(AUTH_KEY);
  }

  isAuthenticated(): boolean {
      return !!localStorage.getItem(AUTH_KEY);
  }

  async getKids(): Promise<Kid[]> {
    try {
      const response = await fetch(`${API_URL}/clubbers`);
      if (!response.ok) {
        throw new Error(`Failed to fetch kids: ${response.statusText}`);
      }
      const kids = await response.json();
      // Cache the fetched data in localStorage
      this.setStoredData(kids.result);
      return kids.result;
    } catch (error) {
      console.error('Error fetching kids from API, falling back to stored data:', error);
      // Fallback to stored data if API call fails
      return this.getStoredData();
    }
  }

  // async getKids(): Promise<Kid[]> {
  //   await delay(DELAY_MS);
  //   return this.getStoredData();
  // }

  async getKidById(id: string): Promise<Kid | undefined> {
    await delay(DELAY_MS);
    const kids = this.getStoredData();
    return kids.find(k => k.id === id);
  }

  async saveKid(kidData: Partial<Kid>): Promise<Kid> {
    await delay(DELAY_MS);
    const kids = this.getStoredData();

    if (kidData.id) {
      // Update existing
      const index = kids.findIndex(k => k.id === kidData.id);
      if (index !== -1) {
        const updatedKid = { ...kids[index], ...kidData } as Kid;
        kids[index] = updatedKid;
        this.setStoredData(kids);
        return updatedKid;
      }
    }

    // Create new
    // We put ...kidData first, then overwrite/ensure defaults.
    // Importantly, we explicitly set 'id' last to ensure it is never undefined,
    // even if kidData contains { id: undefined }.
    const newKid: Kid = {
      name: 'Unknown',
      group: ClubGroup.CUBBY,
      points: 0,
      sectionsCompleted: 0,
      attendanceRate: 100,
      lastAttended: 'Never',
      status: Status.NEW,
      avatarUrl: `https://picsum.photos/100/100?random=${Date.now()}`,
      ...kidData,
      id: Date.now().toString(), // Generate simplified ID (ensure this overrides kidData.id if it's undefined)
    } as Kid;

    const newKids = [newKid, ...kids];
    this.setStoredData(newKids);
    return newKid;
  }

  async deleteKid(id: string): Promise<void> {
    await delay(DELAY_MS);
    const kids = this.getStoredData();
    const filtered = kids.filter(k => k.id !== id);
    this.setStoredData(filtered);
  }

  async saveCredits(clubber_id: string, credits: Record<string, number>): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_URL}/add-clubber-score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clubber_id,
          credits,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to save credits: ${response.statusText}`);
      }

      const data = await response.json();
      return { success: true, message: 'Credits saved successfully' };
    } catch (error) {
      console.error('Error saving credits to database:', error);
      return { success: false, message: 'Failed to save credits to database' };
    }
  }

  async getClubbersScoreTotals(): Promise<any[]> {
    try {
      const response = await fetch(`${API_URL}/clubbers-score-totals`);
      if (!response.ok) {
        throw new Error(`Failed to fetch score totals: ${response.statusText}`);
      }
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error fetching clubber score totals:', error);
      return [];
    }
  }

  async addClubber(clubberData: any): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_URL}/add-clubber`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clubberData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.result || `Failed to add clubber: ${response.statusText}`);
      }

      return { success: true, message: data.result || 'Clubber added successfully' };
    } catch (error) {
      console.error('Error adding clubber:', error);
      return { success: false, message: error instanceof Error ? error.message : 'Failed to add clubber' };
    }
  }

  async getAttendanceStats(): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/attendance-stats`);
      if (!response.ok) {
        throw new Error(`Failed to fetch attendance stats: ${response.statusText}`);
      }
      const result = await response.json();
      return result.data || { attendanceRate: 0, totalClubbers: 0 };
    } catch (error) {
      console.error('Error fetching attendance stats:', error);
      return { attendanceRate: 0, totalClubbers: 0 };
    }
  }

  async getAttendanceTrend(): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/attendance-trend`);
      if (!response.ok) {
        throw new Error(`Failed to fetch attendance trend: ${response.statusText}`);
      }
      const result = await response.json();
      return result.data || { isRising: false, percentageChange: 0, currentWeekRate: 0, previousWeekRate: 0 };
    } catch (error) {
      console.error('Error fetching attendance trend:', error);
      return { isRising: false, percentageChange: 0, currentWeekRate: 0, previousWeekRate: 0 };
    }
  }

  async getNewClubbers(): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/new-clubbers`);
      if (!response.ok) {
        throw new Error(`Failed to fetch new clubbers: ${response.statusText}`);
      }
      const result = await response.json();
      return result.data || { newClubbersMonth: 0, newClubbersWeek: 0, newClubbersToday: 0 };
    } catch (error) {
      console.error('Error fetching new clubbers:', error);
      return { newClubbersMonth: 0, newClubbersWeek: 0, newClubbersToday: 0 };
    }
  }

  async getClubbersNeedingHelp(): Promise<any[]> {
    try {
      const response = await fetch(`${API_URL}/clubbers-needing-help`);
      if (!response.ok) {
        throw new Error(`Failed to fetch clubbers needing help: ${response.statusText}`);
      }
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error fetching clubbers needing help:', error);
      return [];
    }
  }
}

export const Backend = new BackendService();
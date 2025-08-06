import { StorageEnum } from '../base/enums';
import { createStorage } from '../base/base';
import type { BaseStorage } from '../base/types';

const defaultFavoritePromptsForInternet = {
  domain: 'internet',
  prompts: [
    {
      title: `0. What is the current policy rate?`,
      content: `What is the current policy rate?\nGo to https://rbi.org.in/home.aspx.\nSummarise the policy rates and tell me.`,
    },
    {
      title: '2. How many leaves do I have available?',
      content: `How many leaves are available for me?\nGo to https://samadhan.rbi.org.in/irj/portal/\nClick on 'Self service' to find leave information.\nClick on Leave request to find available information\nClick on Entitlements to find available leave information.`,
    },
    {
      title: '3. What is my latest salary statement?',
      content: `What is my latest salary statement?\nGo to https://samadhan.rbi.org.in/irj/portal/\nClick on 'Salary statement'.\nGet the latest salary information.\nTell the gross pay and deductions.\nDownload the latest salary statement.`,
    },
  ],
};
const defaultFavoritePromptsForSamadhan = {
  domain: 'samadhan',
  prompts: [
    {
      title: `1. How many leaves have I availed?`,
      content: `How many leaves are availed by me?\nGo to https://samadhan.rbi.org.in/irj/portal/\nClick on 'Self service' to find leave information.\nClick on Leave request to find the information.\nClick on Leave History to find the information.\nSummarise the details as per the different types of leaves`,
    },
    {
      title: '2. How many leaves do I have available?',
      content: `How many leaves are available for me?\nGo to https://samadhan.rbi.org.in/irj/portal/\nClick on 'Self service' to find leave information.\nClick on Leave request to find available information\nClick on Entitlements to find available leave information.`,
    },
    {
      title: '3. What is my latest salary statement?',
      content: `What is my latest salary statement?\nGo to https://samadhan.rbi.org.in/irj/portal/\nClick on 'Salary statement'.\nGet the latest salary information.\nTell the gross pay and deductions.\nDownload the latest salary statement.`,
    },
  ],
};
const defaultFavoritePromptsForEKP = {
  domain: 'ekp',
  prompts: [
    {
      title: '1. Get latest circulars',
      content: `Go to EKP NEW at https://ekpnew.rbi.org.in/ords/r/rbi_ws/rbi-ekp/home \nGo to circulars.\nSelect published by Department of Information Technology from dropdown.\nFetch the information for latest 5 circulars.`,
    },
  ],
};
const defaultFavoritePromptsForCalendar = {
  domain: 'owa',
  prompts: [
    {
      title: '1. Give my schedule for the day',
      content: `Go to https://mail.rbi.org.in/owa/#path=/calendar/view/Day\nCheck my schedule and give me bullet points for the tasks/meeting that I have planned for the day.\nThe information should have the meeting subject and organiser.`,
    },
    // {
    //   title: '2. Give my weekly schedule',
    //   content: `Go to https://mail.rbi.org.in/owa/#path=/calendar/view/Week
    //   Check my schedule and give me bullet points for the tasks/meeting planned.
    //   The information should have the meeting subject, date and time and organiser.`,
    // },
    // {
    //   title: '3. Give my monthly schedule',
    //   content: `Go to https://mail.rbi.org.in/owa/#path=/calendar/view/Month
    //   Check my schedule and give me bullet points for the tasks/meeting planned.
    //   The information should have the meeting subject, date and time and organiser.`,
    // },
    {
      title: '4. Check my pending unread mails',
      content: `Go to https://mail.rbi.org.in/owa/#path=/mail/inbox\nuse the filter to select the "unread" emails. \nFetch the top 5 emails from today.`,
    },
  ],
};

// Define the favorite prompt type
export interface FavoritePrompt {
  id: number;
  title: string;
  content: string;
}

// Define the favorites storage type
export interface FavoritesStorage {
  nextId: number;
  prompts: FavoritePrompt[];
}

// Define the interface for favorite prompts storage operations
export interface FavoritePromptsStorage {
  addPrompt: (title: string, content: string) => Promise<FavoritePrompt>;
  updatePrompt: (id: number, title: string, content: string) => Promise<FavoritePrompt | undefined>;
  updatePromptTitle: (id: number, title: string) => Promise<FavoritePrompt | undefined>;
  removePrompt: (id: number) => Promise<void>;
  getAllPrompts: () => Promise<FavoritePrompt[]>;
  getPromptById: (id: number) => Promise<FavoritePrompt | undefined>;
  reorderPrompts: (draggedId: number, targetId: number) => Promise<void>;
}

// Initial state with proper typing
const initialState: FavoritesStorage = {
  nextId: 1,
  prompts: [],
};

// Create the favorites storage
const favoritesStorage: BaseStorage<FavoritesStorage> = createStorage('favorites', initialState, {
  storageEnum: StorageEnum.Local,
  liveUpdate: true,
});

/**
 * Creates a storage interface for managing favorite prompts
 */
export function createFavoritesStorage(): FavoritePromptsStorage {
  return {
    addPrompt: async (title: string, content: string): Promise<FavoritePrompt> => {
      // Check if prompt with same content already exists
      const { prompts } = await favoritesStorage.get();
      const existingPrompt = prompts.find(prompt => prompt.content === content);

      // If exists, return the existing prompt
      if (existingPrompt) {
        return existingPrompt;
      }

      // Otherwise add new prompt
      await favoritesStorage.set(prev => {
        const id = prev.nextId;
        const newPrompt: FavoritePrompt = { id, title, content };

        return {
          nextId: id + 1,
          prompts: [newPrompt, ...prev.prompts],
        };
      });

      return (await favoritesStorage.get()).prompts[0];
    },

    updatePrompt: async (id: number, title: string, content: string): Promise<FavoritePrompt | undefined> => {
      let updatedPrompt: FavoritePrompt | undefined;

      await favoritesStorage.set(prev => {
        const updatedPrompts = prev.prompts.map(prompt => {
          if (prompt.id === id) {
            updatedPrompt = { ...prompt, title, content };
            return updatedPrompt;
          }
          return prompt;
        });

        // If prompt wasn't found, leave the storage unchanged
        if (!updatedPrompt) {
          return prev;
        }

        return {
          ...prev,
          prompts: updatedPrompts,
        };
      });

      return updatedPrompt;
    },

    updatePromptTitle: async (id: number, title: string): Promise<FavoritePrompt | undefined> => {
      let updatedPrompt: FavoritePrompt | undefined;

      await favoritesStorage.set(prev => {
        const updatedPrompts = prev.prompts.map(prompt => {
          if (prompt.id === id) {
            updatedPrompt = { ...prompt, title };
            return updatedPrompt;
          }
          return prompt;
        });

        // If prompt wasn't found, leave the storage unchanged
        if (!updatedPrompt) {
          return prev;
        }

        return {
          ...prev,
          prompts: updatedPrompts,
        };
      });

      return updatedPrompt;
    },

    removePrompt: async (id: number): Promise<void> => {
      await favoritesStorage.set(prev => ({
        ...prev,
        prompts: prev.prompts.filter(prompt => prompt.id !== id),
      }));
    },

    getAllPrompts: async (): Promise<FavoritePrompt[]> => {
      const currentState = await favoritesStorage.get();
      let prompts = currentState.prompts;

      // Check if storage is in initial state (empty prompts array and nextId=1)
      if (currentState.prompts.length === 0 && currentState.nextId === 1) {
        const favoritePrompts = [
          ...defaultFavoritePromptsForInternet.prompts,
          ...defaultFavoritePromptsForEKP.prompts,
          ...defaultFavoritePromptsForSamadhan.prompts,
          ...defaultFavoritePromptsForCalendar.prompts,
        ];
        for (const prompt of favoritePrompts) {
          await favoritesStorage.set(prev => {
            const id = prev.nextId;
            const newPrompt: FavoritePrompt = { id, title: prompt.title, content: prompt.content };
            return { nextId: id + 1, prompts: [newPrompt, ...prev.prompts] };
          });
        }
        const newState = await favoritesStorage.get();
        prompts = newState.prompts;
      }
      return [...prompts].sort((a, b) => a.id - b.id);
    },

    getPromptById: async (id: number): Promise<FavoritePrompt | undefined> => {
      const { prompts } = await favoritesStorage.get();
      return prompts.find(prompt => prompt.id === id);
    },

    reorderPrompts: async (draggedId: number, targetId: number): Promise<void> => {
      await favoritesStorage.set(prev => {
        // Create a copy of the current prompts
        const promptsCopy = [...prev.prompts];

        // Find indexes
        const sourceIndex = promptsCopy.findIndex(prompt => prompt.id === draggedId);
        const targetIndex = promptsCopy.findIndex(prompt => prompt.id === targetId);

        // Ensure both indexes are valid
        if (sourceIndex === -1 || targetIndex === -1) {
          return prev; // No changes if either index is invalid
        }

        // Reorder by removing dragged item and inserting at target position
        const [movedItem] = promptsCopy.splice(sourceIndex, 1);
        promptsCopy.splice(targetIndex, 0, movedItem);

        // Assign new IDs based on the order
        const numPrompts = promptsCopy.length;
        const updatedPromptsWithNewIds = promptsCopy.map((prompt, index) => ({
          ...prompt,
          id: numPrompts - index, // Assigns IDs: numPrompts, numPrompts-1, ..., 1
        }));

        return {
          ...prev,
          prompts: updatedPromptsWithNewIds,
          nextId: numPrompts + 1, // Update nextId accordingly
        };
      });
    },
  };
}

// Export an instance of the storage by default
export default createFavoritesStorage();

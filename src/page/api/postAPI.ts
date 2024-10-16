// import {URL} from '../setup/config';

interface Post {
  title: string;
  description: string;
  tag: string;
  dateTime: string;
  userId: number | null;
}

interface Login {
  userId: number | null;
  account: string;
  wif: string;
}

interface Upload {
  image_base64: string;
  username: string;
  wif:string;  
}

interface ApiResponse<T> {
  data: T;
  error?: string;
}

interface ImageData {
  image_url: string;
}

async function apiCall<T>(endpoint: string, method: string, data?: string): Promise<ApiResponse<T>> {
  // const URL = await fetchAssetsUrl();
  const headers = {
    "accept": "application/json",
    "Telegram-Data": window.Telegram?.WebApp?.initData,
    "Content-Type": "application/json"
  };

  try {
    const response = await fetch(`${endpoint}`, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined
    });

    if (!response.ok) {
      throw new Error('API call failed');
    }

    const responseData: T = await response.json();
    return { data: responseData };
  } catch (error: unknown) {
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error('API call error:', errorMessage);
    return { data: {} as T, error: errorMessage };
  }
}

async function UploadCall<T extends ImageData>(endpoint: string, method: string, data?: Upload): Promise<ApiResponse<T>> {
  const headers = {
    "Accept": "application/json",
    "Authorization": window.Telegram?.WebApp?.initData,
    "Content-Type": "application/json"
  };

  try {
    const response = await fetch(endpoint, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined
    });

    if (!response.ok) {
      throw new Error('API call failed');
    }

    const responseData: T = await response.json();
    return { data: responseData };
  } catch (error: unknown) {
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error('API call error:', errorMessage);
    return { data: {} as T, error: errorMessage };
  }
}

export const postAPI = {
  submit: async (post: Post): Promise<ApiResponse<string>> => {    
    return apiCall('/post', 'POST', JSON.stringify(post));
  },

  searchCommunity: async (communityname: string): Promise<ApiResponse<Array<{ id: string, name: string }>>> => {
    return apiCall('/community', 'POST', JSON.stringify({ community: communityname }));
  },

  UploadImage: async (upload: Upload): Promise<ApiResponse<ImageData>> => {
    return UploadCall<ImageData>('https://imridd.eu.pythonanywhere.com/api/hive/upload_base64_image', 'POST', upload);
  },

  login: async (login: Login): Promise<ApiResponse<string>> => {
    return apiCall('/login', 'POST', JSON.stringify(login));
  },

  logoff: async (userId: string): Promise<ApiResponse<string>> => {
    return apiCall('/logoff', 'POST', userId);
  },  
  
};

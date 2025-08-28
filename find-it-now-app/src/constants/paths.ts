type PathParams = {
  home: undefined;
  userProfile: { userId: string };
  editItem: { itemId: string };
  lostItemDetails: { itemId: string };
  lostItemEdit: { itemId: string };
  matchingList: { reportId: string; token: string };
  matchingItemDetails: { itemId: string; token: string };
};

export const PATHS = {
  home: () => '/',
  service: () => '/service',
  login: () => '/login',
  setPassword: () => '/set-password',
  serviceHome: () => '/service',
  report: () => '/item-report',
  register: () => '/register',
  matchingList: ({ reportId, token }: PathParams['matchingList']) =>
    `/matching-list?reportId=${reportId}&token=${token}`,
  matchingItemDetails: ({ itemId, token }: PathParams['matchingItemDetails']) =>
    `/matching-list/${itemId}?token=${token}`,
  lostItems: () => '/user/dashboard/items',
  lostItemDetails: ({ itemId }: PathParams['lostItemDetails']) => `/user/dashboard/items/${itemId}`,
  lostItemCreate: () => '/user/dashboard/items/new',
  lostItemEdit: ({ itemId }: PathParams['lostItemEdit']) => `/user/dashboard/items/${itemId}/edit`,
  pickUpRequests: () => `/user/dashboard/pickup-requests`,
  staffDashboard: () => `/user/dashboard/staff-members`,
  orgDashboard: () => '/user/dashboard/organizations',

  organizationSettings: () => `/user/settings/organization`,
};

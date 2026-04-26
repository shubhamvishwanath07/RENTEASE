const API = 'http://localhost:5000/api';

angular.module('RentEase')

// Auth Service
.service('AuthService', ['$http', function($http) {
  const getToken = () => localStorage.getItem('rentease_token');
  const getUser = () => {
    const u = localStorage.getItem('rentease_user');
    return u ? JSON.parse(u) : null;
  };
  const authHeaders = () => ({ headers: { Authorization: 'Bearer ' + getToken() } });

  return {
    getToken, getUser,
    register: (data) => $http.post(API + '/auth/register', data),
    login: (data) => $http.post(API + '/auth/login', data),
    logout: () => { localStorage.removeItem('rentease_token'); localStorage.removeItem('rentease_user'); },
    saveSession: (token, user) => {
      localStorage.setItem('rentease_token', token);
      localStorage.setItem('rentease_user', JSON.stringify(user));
    },
    getProfile: () => $http.get(API + '/auth/profile', authHeaders()),
    updateProfile: (data) => $http.put(API + '/auth/profile', data, authHeaders())
  };
}])

// Property Service
.service('PropertyService', ['$http', function($http) {
  const authHeaders = () => {
    const token = localStorage.getItem('rentease_token');
    return { headers: { Authorization: 'Bearer ' + token } };
  };

  return {
    getAll: (params) => $http.get(API + '/properties', { params }),
    getById: (id) => $http.get(API + '/properties/' + id),
    getMyListings: () => $http.get(API + '/properties/owner/my-listings', authHeaders()),
    create: (formData) => $http.post(API + '/properties', formData, {
      ...authHeaders(),
      headers: { ...authHeaders().headers, 'Content-Type': undefined },
      transformRequest: angular.identity
    }),
    update: (id, formData) => $http.put(API + '/properties/' + id, formData, {
      ...authHeaders(),
      headers: { ...authHeaders().headers, 'Content-Type': undefined },
      transformRequest: angular.identity
    }),
    delete: (id) => $http.delete(API + '/properties/' + id, authHeaders())
  };
}])

// Booking Service
.service('BookingService', ['$http', function($http) {
  const authHeaders = () => {
    const token = localStorage.getItem('rentease_token');
    return { headers: { Authorization: 'Bearer ' + token } };
  };

  return {
    create: (data) => $http.post(API + '/bookings', data, authHeaders()),
    getMyBookings: () => $http.get(API + '/bookings/my-bookings', authHeaders()),
    getOwnerInquiries: () => $http.get(API + '/bookings/owner-inquiries', authHeaders()),
    update: (id, data) => $http.put(API + '/bookings/' + id, data, authHeaders()),
    cancel: (id) => $http.delete(API + '/bookings/' + id, authHeaders())
  };
}])

// Review Service
.service('ReviewService', ['$http', function($http) {
  const authHeaders = () => {
    const token = localStorage.getItem('rentease_token');
    return { headers: { Authorization: 'Bearer ' + token } };
  };

  return {
    getByProperty: (id) => $http.get(API + '/reviews/' + id),
    create: (data) => $http.post(API + '/reviews', data, authHeaders())
  };
}])

// Admin Service
.service('AdminService', ['$http', function($http) {
  const authHeaders = () => {
    const token = localStorage.getItem('rentease_token');
    return { headers: { Authorization: 'Bearer ' + token } };
  };

  return {
    getStats: () => $http.get(API + '/admin/stats', authHeaders()),
    getUsers: () => $http.get(API + '/admin/users', authHeaders()),
    deleteUser: (id) => $http.delete(API + '/admin/users/' + id, authHeaders()),
    getProperties: () => $http.get(API + '/admin/properties', authHeaders()),
    approveProperty: (id, data) => $http.put(API + '/admin/properties/' + id + '/approve', data, authHeaders()),
    deleteProperty: (id) => $http.delete(API + '/admin/properties/' + id, authHeaders())
  };
}])

// Favorites Service
.service('FavoriteService', ['$http', function($http) {
  const authHeaders = () => {
    const token = localStorage.getItem('rentease_token');
    return { headers: { Authorization: 'Bearer ' + token } };
  };

  return {
    toggle: (propertyId) => $http.post(API + '/favorites/toggle/' + propertyId, {}, authHeaders()),
    getAll: () => $http.get(API + '/favorites', authHeaders())
  };
}]);

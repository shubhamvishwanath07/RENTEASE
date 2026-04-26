angular.module('RentEase')

// NAV CONTROLLER
.controller('NavCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
  $scope.currentUser = $rootScope.currentUser;
  $scope.isOwner = $rootScope.isOwner;
  $scope.isAdmin = $rootScope.isAdmin;
  $scope.logout = $rootScope.logout;
}])

// HOME CONTROLLER
.controller('HomeCtrl', ['$scope', '$location', 'PropertyService', function($scope, $location, PropertyService) {
  $scope.search = {};
  $scope.featuredProperties = [];
  $scope.loading = true;

  PropertyService.getAll({ featured: true }).then(res => {
    $scope.featuredProperties = res.data.slice(0, 8);
    $scope.loading = false;
  }).catch(() => { $scope.loading = false; });

  $scope.doSearch = function() {
    const params = {};
    if ($scope.search.city) params.city = $scope.search.city;
    if ($scope.search.bhkType) params.bhkType = $scope.search.bhkType;
    if ($scope.search.query) params.search = $scope.search.query;
    $location.path('/properties').search(params);
  };

  $scope.goToProperty = function(id) { $location.path('/property/' + id); };

  $scope.stats = [
    { number: '5,000+', label: 'Listed Properties' },
    { number: '200+', label: 'Cities Covered' },
    { number: '50,000+', label: 'Happy Tenants' },
    { number: '10,000+', label: 'Verified Owners' }
  ];
}])

// PROPERTIES LISTING CONTROLLER
.controller('PropertiesCtrl', ['$scope', '$location', '$routeParams', 'PropertyService', function($scope, $location, $routeParams, PropertyService) {
  $scope.properties = [];
  $scope.loading = true;
  $scope.filters = {
    city: $location.search().city || '',
    bhkType: $location.search().bhkType || '',
    furnished: '',
    minRent: '',
    maxRent: '',
    search: $location.search().search || ''
  };

  $scope.loadProperties = function() {
    $scope.loading = true;
    const params = {};
    if ($scope.filters.city) params.city = $scope.filters.city;
    if ($scope.filters.bhkType) params.bhkType = $scope.filters.bhkType;
    if ($scope.filters.furnished) params.furnished = $scope.filters.furnished;
    if ($scope.filters.minRent) params.minRent = $scope.filters.minRent;
    if ($scope.filters.maxRent) params.maxRent = $scope.filters.maxRent;
    if ($scope.filters.search) params.search = $scope.filters.search;

    PropertyService.getAll(params).then(res => {
      $scope.properties = res.data;
      $scope.loading = false;
    }).catch(() => { $scope.loading = false; });
  };

  $scope.applyFilters = function() { $scope.loadProperties(); };
  $scope.clearFilters = function() {
    $scope.filters = { city: '', bhkType: '', furnished: '', minRent: '', maxRent: '', search: '' };
    $scope.loadProperties();
  };

  $scope.goToProperty = function(id) { $location.path('/property/' + id); };
  $scope.loadProperties();
}])

// PROPERTY DETAIL CONTROLLER
.controller('PropertyDetailCtrl', ['$scope', '$rootScope', '$routeParams', '$location', 'PropertyService', 'BookingService', 'ReviewService', 'FavoriteService',
  function($scope, $rootScope, $routeParams, $location, PropertyService, BookingService, ReviewService, FavoriteService) {
    $scope.property = null;
    $scope.reviews = [];
    $scope.loading = true;
    $scope.booking = {};
    $scope.review = { rating: 5, comment: '' };
    $scope.calcMonths = 12;
    $scope.activeImg = '';
    $scope.bookingSuccess = false;
    $scope.bookingError = '';
    $scope.reviewError = '';
    $scope.reviewSuccess = false;
    $scope.isFavorite = false;

    const id = $routeParams.id;

    PropertyService.getById(id).then(res => {
      $scope.property = res.data;
      $scope.activeImg = res.data.images && res.data.images.length ? res.data.images[0] : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800';
      $scope.loading = false;
    }).catch(() => { $scope.loading = false; });

    ReviewService.getByProperty(id).then(res => { $scope.reviews = res.data; });

    $scope.calcTotal = function() {
      if (!$scope.property) return 0;
      return ($scope.property.rent * $scope.calcMonths) + $scope.property.deposit;
    };

    $scope.submitBooking = function() {
      if (!$rootScope.isLoggedIn()) return $location.path('/login');
      $scope.bookingError = '';
      const data = {
        property: $scope.property._id,
        visitDate: $scope.booking.visitDate,
        message: $scope.booking.message,
        phone: $scope.booking.phone
      };
      BookingService.create(data).then(() => {
        $scope.bookingSuccess = true;
        $scope.booking = {};
        showToast('Inquiry sent successfully!', 'success');
      }).catch(err => {
        $scope.bookingError = err.data?.message || 'Failed to send inquiry';
      });
    };

    $scope.submitReview = function() {
      if (!$rootScope.isLoggedIn()) return $location.path('/login');
      ReviewService.create({ property: id, rating: $scope.review.rating, comment: $scope.review.comment })
        .then(res => {
          $scope.reviews.unshift(res.data);
          $scope.reviewSuccess = true;
          $scope.review = { rating: 5, comment: '' };
          showToast('Review submitted!', 'success');
        }).catch(err => { $scope.reviewError = err.data?.message || 'Error submitting review'; });
    };

    $scope.toggleFavorite = function() {
      if (!$rootScope.isLoggedIn()) return $location.path('/login');
      FavoriteService.toggle($scope.property._id).then(() => {
        $scope.isFavorite = !$scope.isFavorite;
        showToast($scope.isFavorite ? 'Saved to favorites!' : 'Removed from favorites', 'success');
      });
    };

    $scope.setImg = function(img) { $scope.activeImg = img; };
    $scope.starsArray = (n) => Array(Math.round(n)).fill(0);
  }
])

// LOGIN CONTROLLER
.controller('LoginCtrl', ['$scope', '$rootScope', '$location', 'AuthService', function($scope, $rootScope, $location, AuthService) {
  if ($rootScope.isLoggedIn()) $location.path('/');
  $scope.form = {};
  $scope.error = '';
  $scope.loading = false;

  $scope.submit = function() {
    $scope.error = '';
    $scope.loading = true;
    AuthService.login($scope.form).then(res => {
      AuthService.saveSession(res.data.token, res.data.user);
      $rootScope.currentUser = res.data.user;
      showToast('Welcome back, ' + res.data.user.name + '!', 'success');
      const role = res.data.user.role;
      if (role === 'admin') $location.path('/admin-dashboard');
      else if (role === 'owner') $location.path('/owner-dashboard');
      else $location.path('/');
    }).catch(err => {
      $scope.error = err.data?.message || 'Login failed. Check your credentials.';
      $scope.loading = false;
    });
  };
}])

// REGISTER CONTROLLER
.controller('RegisterCtrl', ['$scope', '$rootScope', '$location', 'AuthService', function($scope, $rootScope, $location, AuthService) {
  if ($rootScope.isLoggedIn()) $location.path('/');
  $scope.form = { role: 'tenant' };
  $scope.error = '';
  $scope.loading = false;

  $scope.setRole = function(role) { $scope.form.role = role; };

  $scope.submit = function() {
    $scope.error = '';
    if ($scope.form.password !== $scope.form.confirmPassword) {
      return $scope.error = 'Passwords do not match';
    }
    $scope.loading = true;
    AuthService.register($scope.form).then(res => {
      AuthService.saveSession(res.data.token, res.data.user);
      $rootScope.currentUser = res.data.user;
      showToast('Account created! Welcome to RentEase!', 'success');
      const role = res.data.user.role;
      if (role === 'owner') $location.path('/owner-dashboard');
      else $location.path('/');
    }).catch(err => {
      $scope.error = err.data?.message || 'Registration failed.';
      $scope.loading = false;
    });
  };
}])

// OWNER DASHBOARD CONTROLLER
.controller('OwnerCtrl', ['$scope', '$rootScope', '$location', 'PropertyService', 'BookingService',
  function($scope, $rootScope, $location, PropertyService, BookingService) {
    if (!$rootScope.isOwner()) return $location.path('/login');
    $scope.listings = [];
    $scope.inquiries = [];
    $scope.activeTab = 'listings';
    $scope.showForm = false;
    $scope.editMode = false;
    $scope.form = { amenities: '' };
    $scope.formError = '';
    $scope.loading = true;

    $scope.loadListings = function() {
      PropertyService.getMyListings().then(res => {
        $scope.listings = res.data;
        $scope.loading = false;
      }).catch(() => { $scope.loading = false; });
    };

    $scope.loadInquiries = function() {
      BookingService.getOwnerInquiries().then(res => { $scope.inquiries = res.data; });
    };

    $scope.loadListings();
    $scope.loadInquiries();

    $scope.openAddForm = function() {
      $scope.form = { amenities: '' };
      $scope.editMode = false;
      $scope.showForm = true;
      $scope.formError = '';
    };

    $scope.openEditForm = function(prop) {
      $scope.form = Object.assign({}, prop, { amenities: (prop.amenities || []).join(', ') });
      $scope.editMode = true;
      $scope.showForm = true;
      $scope.formError = '';
    };

    $scope.closeForm = function() { $scope.showForm = false; };

    $scope.submitForm = function() {
      $scope.formError = '';
      const fd = new FormData();
      const amenities = ($scope.form.amenities || '').split(',').map(a => a.trim()).filter(Boolean);

      const fields = ['title', 'location', 'city', 'address', 'rent', 'bhkType', 'furnished', 'description', 'area', 'deposit'];
      fields.forEach(f => { if ($scope.form[f]) fd.append(f, $scope.form[f]); });
      fd.append('amenities', JSON.stringify(amenities));

      const fileInput = document.getElementById('propertyImages');
      if (fileInput && fileInput.files.length) {
        for (let f of fileInput.files) fd.append('images', f);
      }

      const action = $scope.editMode
        ? PropertyService.update($scope.form._id, fd)
        : PropertyService.create(fd);

      action.then(() => {
        $scope.showForm = false;
        $scope.loadListings();
        showToast($scope.editMode ? 'Listing updated! Awaiting approval.' : 'Property submitted for approval!', 'success');
      }).catch(err => { $scope.formError = err.data?.message || 'Failed to save listing.'; });
    };

    $scope.deleteListing = function(id) {
      if (!confirm('Are you sure you want to delete this listing?')) return;
      PropertyService.delete(id).then(() => {
        $scope.listings = $scope.listings.filter(p => p._id !== id);
        showToast('Listing deleted.', 'success');
      });
    };

    $scope.updateInquiry = function(booking, status) {
      BookingService.update(booking._id, { status }).then(res => {
        const idx = $scope.inquiries.findIndex(b => b._id === booking._id);
        if (idx !== -1) $scope.inquiries[idx] = res.data;
        showToast('Inquiry ' + status + '.', 'success');
      });
    };

    $scope.setTab = function(tab) { $scope.activeTab = tab; };
  }
])

// ADMIN DASHBOARD CONTROLLER
.controller('AdminCtrl', ['$scope', '$rootScope', '$location', 'AdminService',
  function($scope, $rootScope, $location, AdminService) {
    if (!$rootScope.isAdmin()) return $location.path('/login');
    $scope.stats = {};
    $scope.users = [];
    $scope.properties = [];
    $scope.activeTab = 'overview';

    AdminService.getStats().then(res => { $scope.stats = res.data; });
    AdminService.getUsers().then(res => { $scope.users = res.data; });
    AdminService.getProperties().then(res => { $scope.properties = res.data; });

    $scope.setTab = function(tab) { $scope.activeTab = tab; };

    $scope.deleteUser = function(id) {
      if (!confirm('Delete this user?')) return;
      AdminService.deleteUser(id).then(() => {
        $scope.users = $scope.users.filter(u => u._id !== id);
        $scope.stats.users--;
        showToast('User deleted.', 'success');
      });
    };

    $scope.approveProperty = function(prop, approved) {
      AdminService.approveProperty(prop._id, { isApproved: approved }).then(res => {
        const idx = $scope.properties.findIndex(p => p._id === prop._id);
        if (idx !== -1) $scope.properties[idx] = res.data;
        showToast('Property ' + (approved ? 'approved' : 'unapproved') + '.', 'success');
        AdminService.getStats().then(r => { $scope.stats = r.data; });
      });
    };

    $scope.toggleFeatured = function(prop) {
      AdminService.approveProperty(prop._id, { isApproved: prop.isApproved, isFeatured: !prop.isFeatured }).then(res => {
        const idx = $scope.properties.findIndex(p => p._id === prop._id);
        if (idx !== -1) $scope.properties[idx] = res.data;
        showToast('Featured status updated.', 'success');
      });
    };

    $scope.deleteProperty = function(id) {
      if (!confirm('Delete this property?')) return;
      AdminService.deleteProperty(id).then(() => {
        $scope.properties = $scope.properties.filter(p => p._id !== id);
        showToast('Property deleted.', 'success');
      });
    };
  }
])

// MY BOOKINGS CONTROLLER
.controller('MyBookingsCtrl', ['$scope', '$rootScope', '$location', 'BookingService',
  function($scope, $rootScope, $location, BookingService) {
    if (!$rootScope.isLoggedIn()) return $location.path('/login');
    $scope.bookings = [];
    $scope.loading = true;

    BookingService.getMyBookings().then(res => {
      $scope.bookings = res.data;
      $scope.loading = false;
    }).catch(() => { $scope.loading = false; });

    $scope.cancel = function(id) {
      if (!confirm('Cancel this booking?')) return;
      BookingService.cancel(id).then(() => {
        $scope.bookings = $scope.bookings.filter(b => b._id !== id);
        showToast('Booking cancelled.', 'success');
      });
    };
  }
])

// FAVORITES CONTROLLER
.controller('FavoritesCtrl', ['$scope', '$rootScope', '$location', 'FavoriteService',
  function($scope, $rootScope, $location, FavoriteService) {
    if (!$rootScope.isLoggedIn()) return $location.path('/login');
    $scope.favorites = [];
    $scope.loading = true;

    FavoriteService.getAll().then(res => {
      $scope.favorites = res.data;
      $scope.loading = false;
    }).catch(() => { $scope.loading = false; });

    $scope.remove = function(id) {
      FavoriteService.toggle(id).then(() => {
        $scope.favorites = $scope.favorites.filter(p => p._id !== id);
        showToast('Removed from favorites.', 'success');
      });
    };

    $scope.goToProperty = function(id) { $location.path('/property/' + id); };
  }
])

// CONTACT CONTROLLER
.controller('ContactCtrl', ['$scope', function($scope) {
  $scope.form = {};
  $scope.sent = false;
  $scope.submit = function() {
    $scope.sent = true;
    $scope.form = {};
    showToast('Message sent! We will get back to you soon.', 'success');
  };
}]);

angular.module('RentEase', ['ngRoute'])

.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', { templateUrl: 'views/home.html', controller: 'HomeCtrl' })
    .when('/properties', { templateUrl: 'views/properties.html', controller: 'PropertiesCtrl' })
    .when('/property/:id', { templateUrl: 'views/property-detail.html', controller: 'PropertyDetailCtrl' })
    .when('/login', { templateUrl: 'views/login.html', controller: 'LoginCtrl' })
    .when('/register', { templateUrl: 'views/register.html', controller: 'RegisterCtrl' })
    .when('/owner-dashboard', { templateUrl: 'views/owner-dashboard.html', controller: 'OwnerCtrl' })
    .when('/admin-dashboard', { templateUrl: 'views/admin-dashboard.html', controller: 'AdminCtrl' })
    .when('/my-bookings', { templateUrl: 'views/my-bookings.html', controller: 'MyBookingsCtrl' })
    .when('/favorites', { templateUrl: 'views/favorites.html', controller: 'FavoritesCtrl' })
    .when('/contact', { templateUrl: 'views/contact.html', controller: 'ContactCtrl' })
    .otherwise({ redirectTo: '/' });
}])

.run(['$rootScope', 'AuthService', '$location', function($rootScope, AuthService, $location) {
  $rootScope.currentUser = AuthService.getUser();
  $rootScope.isLoggedIn = () => !!$rootScope.currentUser;
  $rootScope.isOwner = () => $rootScope.currentUser && ($rootScope.currentUser.role === 'owner' || $rootScope.currentUser.role === 'admin');
  $rootScope.isAdmin = () => $rootScope.currentUser && $rootScope.currentUser.role === 'admin';
  $rootScope.logout = () => {
    AuthService.logout();
    $rootScope.currentUser = null;
    $location.path('/');
    showToast('Logged out successfully', 'success');
  };

  $rootScope.$on('$routeChangeStart', function(event, next) {
    const protected_routes = ['/owner-dashboard', '/admin-dashboard', '/my-bookings', '/favorites'];
    const path = next.$$route ? next.$$route.originalPath : '';
    if (protected_routes.includes(path) && !$rootScope.isLoggedIn()) {
      event.preventDefault();
      $location.path('/login');
    }
  });
}]);

function showToast(msg, type) {
  var el = document.getElementById('liveToast');
  var msgEl = document.getElementById('toastMsg');
  if (!el || !msgEl) return;
  msgEl.textContent = msg;
  el.className = 'toast align-items-center text-white border-0 ' + (type === 'success' ? 'bg-success' : type === 'error' ? 'bg-danger' : 'bg-primary');
  var toast = new bootstrap.Toast(el, { delay: 3000 });
  toast.show();
}

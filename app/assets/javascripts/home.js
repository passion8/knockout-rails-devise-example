var user = {name: '', id: '' , email: ''}; 

var ajaxSubmit = function  (data,onSuccess,onError) {
    var form = $(data).serialize();
    var url = $(data).attr('action');
    $.ajax(url + '.json', {
        data: form,
        type: 'post',
        beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
        dataType: 'json',
        timeout: 8000,
        cache: false,
        success: onSuccess,
        error: onError 
      } 
    );
};


var authticatedViewModel = function() {
  var self = this;
  // self.signOut = ko.observable();

    self.currentRequest = ko.observable(false);
    self.flashMessage = ko.observable('');


    self.showFlash = function(msg){
      self.currentRequest(true);
      self.flashMessage(msg);
    }

    self.displayFlash = ko.computed(function(){
      if (self.flashMessage().length  >= 0 && self.currentRequest() )  {
        return true;
      } 
    }, this);


  self.email = ko.observable(user.email);
  self.name = ko.observable(user.name);
  self.id = ko.observable(user.id);
  self.password = '';
  self.current_password = ko.observable();
  self.updateInformation = ko.observable();

  self.updateInformation = function  (data) {
    var onSuccess = function  (res) {
      self.name(res.name);
      self.id(res.id);
      self.email(res.email);
      self.showFlash('Information Updated');
    }
    var onError = function ( jqXHR, textStatus,errorThrow) {
      if (jqXHR.status == 401) {
        self.showFlash('please provide correct data');
      }
    }
    ajaxSubmit(data,onSuccess,onError);
  };
  self.signOut = function  (data) {
    return true;
  }

};

var unauthenticatedViewModel = function()  {

  var self = this;
  
  self.currentPage = ko.observable();
  self.email = ko.observable();
  self.id = ko.observable();
  
  self.isSignedIn = ko.observable(false);
  self.current_password = ko.observable();
  self.update_password = ko.observable();
  self.update_password_confirmation = ko.observable();
  self.name = ko.observable();
  self.password = '';
  self.authenticity_token = '';
  self.new_signup_password = ko.observable();
  self.new_signup_password_confirmation = ko.observable();
  self.currentRequest = ko.observable(false);
  self.flashMessage = ko.observable('');


  self.showFlash = function(msg){
    self.currentRequest(true);
    self.flashMessage(msg);
  }

  self.displayFlash = ko.computed(function(){
    if (self.flashMessage().length  >= 0 && self.currentRequest() )  {
      return true;
    } 
  }, this);

  self.showSignin =  function() {
    makeClickableAndProvideHash('signin');
  };


  self.showSignUp =  function() {
    makeClickableAndProvideHash('signup');

  };

  self.showRetrievePassword =  function() {
     makeClickableAndProvideHash('retrieve-password');
  };

  self.signUp = function (data) {
    var onSuccess = function(res){
        self.showFlash('Thanks, you are signed up');
        window.setTimeout(function() { location.href = location.origin + '/dashboard' }, 10000);
      };
      var onError = function  (jqXHR, textStatus,errorThrow) {
        self.showFlash(jqXHR.responseJSON[0]);
      }
    ajaxSubmit(data, onSuccess, onError);
  };

  self.signin = function(data){
      var success = function(res){
        self.showFlash('You are signed in. we are redirecting you');
        // setTimeout(location.href = location.origin + '/dashboard', 15000);
        location.href = location.origin + '/dashboard';
      }
      var errror = function  (data) {

        self.showFlash(data.responseJSON.error);
      }
    ajaxSubmit( data, success , errror );
  };




  self.signOut = function(data){
    ajaxSubmit(data,function(data, textStatus) { 
      self.isSignedIn(false);
      self.showFlash('Bye!');
      location.reload();
    })
  };



  self.passwordMatch = function() {
    if (self.new_signup_password() === self.new_signup_password_confirmation())
      return true;
    else
      return false;
  };



  // private methods
  var makeClickableAndProvideHash = function (name) {
      self.currentPage(name);
      location.hash = name;
  };


  var ajaxSubmit = function  (data,onSuccess,onError) {
    var form = $(data).serialize();
    var url = $(data).attr('action');
    
    $.ajax(url + '.json', {
      data: form,
      type: 'post',
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      dataType: 'json',
      timeout: 8000,
      cache: false,
      success: onSuccess,
      error: onError
    }
    )
  };





  // direct call
   Sammy(function() {
    
    this.get('#:page', function() {
        self.currentPage(this.params.page);
    });
    this.get('/dashboard',function(){
      self.currentPage('dashboard');
    })

    this.get('', function() { this.app.runRoute('get', '#signin') });
    this._checkFormSubmission = function(form) {
        return (false);
    };

  }).run();

   // self.isSignedIn(false);
  // self.currentRequest(true);
  // self.flashMessage('ssss');
};

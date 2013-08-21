
// var authticateViewModel = {};
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
  self.showFlash = ko.observable();
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
    var _callback = function(res){
        self.showFlash('You were signedup');
        setCookie('user_id',res.id,1);
        self.id(res.id);
        self.email(res.email);
        self.name(res.name);
        self.isSignedIn(true);
        $('meta[name="csrf-token"]').attr('content' , res.token) //ugly hack 
      };
    ajaxSubmit(data, _callback);
  };

  self.signin = function(data){
      var _callback = function(res){
        self.showFlash('You are signed in');
        setCookie('user_id',res.id,1);
        self.id(res.id);
        self.email(res.email);
        self.name(res.name);
        self.isSignedIn(true);
        $('meta[name="csrf-token"]').attr('content' , res.token) //ugly hack 
      };
    ajaxSubmit( data, _callback );
  };

  self.updateInformation = function  (data) {
    var onSuccess = function  () {
      self.showFlash('Information updated');
      self.isSignedIn(true);
    };
    ajaxSubmit(data,onSuccess);
  };

  self.retrievePassword = function(data){
    var onSuccess = function() {
      self.showFlash('Password request sent');
    };
    ajaxSubmit(data,onSuccess);
  };

  self.signOut = function(data){
    ajaxSubmit(data,function(data, textStatus) { 
      self.isSignedIn(false);
      self.showFlash('Bye!');
      location.reload();
    })
  };

  self.logout = function(data) {
    
  }

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

  function setCookie(c_name,value,exdays)
    {
    var exdate=new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
    document.cookie=c_name + "=" + c_value;
    }

    function getCookie(c_name)
      {
      var c_value = document.cookie;
      var c_start = c_value.indexOf(" " + c_name + "=");
      if (c_start == -1)
        {
        c_start = c_value.indexOf(c_name + "=");
        }
      if (c_start == -1)
        {
        c_value = null;
        }
      else
        {
        c_start = c_value.indexOf("=", c_start) + 1;
        var c_end = c_value.indexOf(";", c_start);
        if (c_end == -1)
        {
      c_end = c_value.length;
      }
      c_value = unescape(c_value.substring(c_start,c_end));
      }
      return c_value;
      }

  var ajaxSubmit = function  (data,onSuccess) {
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
      error: function(data,textStatus) {
        self.showFlash('error occured');
        }
      } 
    );
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

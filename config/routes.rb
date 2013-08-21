KnockoutRailsDeviseExample::Application.routes.draw do


  devise_for :users , controllers: { sessions: "customs/sessions", registrations: 'customs/registrations' } 
  # , \
       # :path_names => { :sign_in => '#signin', :sign_up => '#signup' } , :path => '/' 
  

  

  get '/dashboard' => "home#dashboard"
  
  root :to => "home#index"
end

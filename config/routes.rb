KnockoutRailsDeviseExample::Application.routes.draw do

  # match 'users/sign_in' =>  redirect("/#signin") 
  # match 'users/sign_up' =>  redirect("/#signup")


  devise_for :users , controllers: { sessions: "customs/sessions", registrations: 'customs/registrations' } 
  # , \
       # :path_names => { :sign_in => '#signin', :sign_up => '#signup' } , :path => '/' 

  get '/dashboard' => "home#dashboard"
  
  root :to => "home#index"
end

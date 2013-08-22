class HomeController < ApplicationController
    
  before_filter :authenticate_user! , except: :index

  def index
    @user = User.new
    redirect_to :dashboard if user_signed_in?
  end

  def dashboard
  	@user = current_user
  end

end

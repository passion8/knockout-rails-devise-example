class HomeController < ApplicationController
    
  before_filter :authenticate_user! , except: :index

  def index

    @user = User.new
  end

  def dashboard
  	@user = current_user
  end

end

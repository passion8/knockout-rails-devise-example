class Customs::RegistrationsController  < Devise::RegistrationsController
  
  # def new
  #   raise
  # end
  
  def create
    build_resource(sign_up_params)
    if resource.save
      if resource.active_for_authentication?
        sign_up(resource_name, resource)
        
        
        @token = session[:_csrf_token] = SecureRandom.base64(32)
        @data = resource
        @data['token'] = @token
        render :json => @data.to_json

      else
        set_flash_message :notice, :"signed_up_but_#{resource.inactive_message}" if is_navigational_format?
        expire_session_data_after_sign_in!
        respond_with resource, :location => after_inactive_sign_up_path_for(resource)
      end
    else
      respond_to do |format| 
          format.html { 
            clean_up_passwords resource
            respond_with resource
          }
          format.json { render json: resource , status: :unprocessable_entity }
      end
    end
  end

  def update
    # raise
    self.resource = resource_class.to_adapter.get!(send(:"current_#{resource_name}").to_key)
    prev_unconfirmed_email = resource.unconfirmed_email if resource.respond_to?(:unconfirmed_email)

    if resource.update_with_password(account_update_params)
      if is_navigational_format?
        flash_key = update_needs_confirmation?(resource, prev_unconfirmed_email) ?
          :update_needs_confirmation : :updated
        set_flash_message :notice, flash_key
      end
      sign_in resource_name, resource, :bypass => true
      respond_to do |format| 
        format.html do
          respond_with resource, :location => after_update_path_for(resource)
        end
        format.json do
          
          render json: resource ,
                       status: :accepted 
        end
      end

      
    else
      respond_to do |format| 
        format.html do
          clean_up_passwords resource
          respond_with resource
        end
        format.json do
          render json: resource ,
                       status: :unauthorized
        end
      end

    end
  end

end
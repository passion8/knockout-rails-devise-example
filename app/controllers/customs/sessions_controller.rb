class Customs::SessionsController  < Devise::SessionsController
   
   def create

        if  self.resource = warden.authenticate!(auth_options)
          set_flash_message(:notice, :signed_in) if is_navigational_format?

          sign_in(resource_name, resource)
          # @token = session[:_csrf_token] = SecureRandom.base64(32)
          @data = resource
          # @data['token'] = @token
          respond_to do |format| 
            format.json { render :json => @data.to_json , :status => :ok }
          end
        else
          respond_to do |format| 
            format.json { render :json => { :status => 401 } }
          end
        end
        
    end

  
end
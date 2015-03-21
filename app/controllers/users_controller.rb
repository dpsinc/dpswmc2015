class UsersController < ApplicationController
  http_basic_authenticate_with :name => 'dpsinc', :password => 'T0ny!remix', only: [:index]

  before_action :set_user, only: [:show, :edit, :update, :destroy]

  layout "frontpage"

  # GET /users
  def index
    @users = User.all
  end

  # GET /users/1
  def show
  end

  # GET /users/new
  def new
    @user = User.new
    render layout: "frontpage"
  end

  # GET /users/1/edit
  def edit
  end

  # POST /users
  def create
    #@user = User.new(user_params)
	@user = User.find_or_create_by(:email => params[:user][:email])
	@user.name = params[:user][:name]
    if @user.save
      #redirect_to @user, notice: 'User was successfully created.'
	  session[:user_id] = @user.id
	  respond_to do |format|
		  format.html { redirect_to new_entry_path }
		  format.js {  }
		  format.json { render json: @user }
	  end
    else
      render :new
    end
  end

  # PATCH/PUT /users/1
  def update
    if @user.update(user_params)
      redirect_to @user, notice: 'User was successfully updated.'
    else
      render :edit
    end
  end

  # DELETE /users/1
  def destroy
    @user.destroy
    redirect_to users_url, notice: 'User was successfully destroyed.'
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user
      @user = User.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def user_params
      params.require(:user).permit(:name, :email)
    end
end

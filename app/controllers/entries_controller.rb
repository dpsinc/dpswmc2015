class EntriesController < ApplicationController
  before_action :set_user, only: [:new, :create]
  before_action :set_entry, only: [:show, :edit, :update, :destroy]

  # GET /entries
  def index
    @entries = Entry.all
  end

  # GET /entries/1
  def show
  end

  # GET /entries/new
  def new
	@entry = Entry.new
  end

  # GET /entries/1/edit
  def edit
  end

  # POST /entries
  def create
	@user = User.find(session[:user_id])
    @entry = Entry.new(:user_id => @user.id)
	@notes = params[:notes]
	@notes.each do |n|
		@note = Note.new
		@note.note = n[:note]
		@note.key = n[:key]
		@entry.notes << @note
	end
    respond_to do |format|
	    if @entry.save
	      format.html { redirect_to @entry, notice: 'Entry was successfully created.' }
	      format.json { render json: @entry, status: :created, location: @entry }
	    else
	      format.html { render :new }
	       format.json { render json: @entry.errors, status: :unprocessable_entity }
	    end
	  end
  end

  # PATCH/PUT /entries/1
  def update
    if @entry.update(entry_params)
      redirect_to @entry, notice: 'Entry was successfully updated.'
    else
      render :edit
    end
  end

  # DELETE /entries/1
  def destroy
    @entry.destroy
    redirect_to entries_url, notice: 'Entry was successfully destroyed.'
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user
		if !session[:user_id]
			redirect_to new_user_path
		else
			@user = User.find(session[:user_id])
	    end
	end
    def set_entry
      @entry = Entry.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def entry_params
      params.require(:entry).permit(:notes => [])
    end
end

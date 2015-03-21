class PagesController < ApplicationController
  def rules
  end
  def booth
	  @user = User.new
	  render layout: 'booth'
  end
end
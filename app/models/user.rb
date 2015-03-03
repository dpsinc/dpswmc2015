class User < ActiveRecord::Base

	has_many :designs

	validates_presence_of :email
	validates_uniqueness_of :email
	validates_format_of :email, :with => /@/

end
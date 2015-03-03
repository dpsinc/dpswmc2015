class User < ActiveRecord::Base
	has_many :entries
	has_many :notes, through: :entries
	validates_presence_of :email
	validates_uniqueness_of :email
	validates_format_of :email, :with => /@/
end
class Entry < ActiveRecord::Base
	belongs_to :user
	has_many :notes, :dependent => :destroy
	accepts_nested_attributes_for :notes, :allow_destroy => true
	is_impressionable :counter_cache => true
end
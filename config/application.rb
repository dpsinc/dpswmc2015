require File.expand_path('../boot', __FILE__)

require 'rails/all'

Bundler.require(:default, Rails.env)

module Dpswmc2015
	class Application < Rails::Application
		config.assets.paths << Rails.root.join('audio', 'video')
		config.assets.precompile += %w( frontpage.js frontpage.css )
	end
end
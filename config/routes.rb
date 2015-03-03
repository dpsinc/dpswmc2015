Dpswmc2015::Application.routes.draw do

	root 'users#new'
	resources :users
	resources :entries
	resources :notes

end
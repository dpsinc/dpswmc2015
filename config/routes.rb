Dpswmc2015::Application.routes.draw do

	root 'users#new'
	resources :users, only: [:new, :create, :index]
	resources :entries, only: [:new, :create, :index, :show]
	resources :notes, only: [:create]

end
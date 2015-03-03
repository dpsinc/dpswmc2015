Dpswmc2015::Application.routes.draw do

	root 'pages#index'
	resources :users
	resources :entries
	resources :notes

end
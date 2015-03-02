Dpswmc2015::Application.routes.draw do

  resources :notes

  resources :designs

  resources :users

	root 'pages#index'

end
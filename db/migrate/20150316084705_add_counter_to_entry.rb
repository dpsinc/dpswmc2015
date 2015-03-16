class AddCounterToEntry < ActiveRecord::Migration
  def change
	add_column :entries, :impressions_count, :integer
  end
end

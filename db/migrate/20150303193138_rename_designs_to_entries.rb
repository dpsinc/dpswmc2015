class RenameDesignsToEntries < ActiveRecord::Migration
  def change
	rename_table :designs, :entries
  end
end

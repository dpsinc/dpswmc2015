class RenameDesignIdToEntryId < ActiveRecord::Migration
  def change
	rename_column :notes, :design_id, :entry_id
  end
end

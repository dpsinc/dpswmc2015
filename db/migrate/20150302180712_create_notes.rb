class CreateNotes < ActiveRecord::Migration
  def change
    create_table :notes do |t|
      t.integer :design_id
      t.integer :note
      t.integer :key

      t.timestamps
    end
  end
end

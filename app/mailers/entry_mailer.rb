class EntryMailer < ActionMailer::Base
  default from: '"DPS Inc." <marketing@dpsinc.com>'
  def create(entry)
	  @entry = entry
	  mail(to: @entry.user.email, subject: 'Share Your Design!')
  end
end
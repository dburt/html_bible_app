#!/usr/bin/ruby

html_files = Dir['*.html']; html_files.size

for fn in html_files
  print fn, ": reading..."
  html = File.read(fn)
  print "done. "

  # remove dodgy inline css
  #html.gsub!(/ style=".*?"/, '')

  # mark up book title
  html.sub! /<p><b>(.*?)<\/b>.*?<\/p>/, "<h2>\\1</h2>"
  book = $1
  book_slug = $1.scan(/\w+/).join("-").downcase

  # mark up chapter index
  html.sub! /<p>Jump(.*?)<\/p>/, "<nav class='chapters'>Jump\\1</nav>"
  
  # make links and anchors for chapters
  #html.gsub!(/<b>(\d+)<\/b>/, "<a name='chapter-\\1'>\\&</a>")
  #html.gsub!(/\[(\d+)\]/, "<a href='#chapter-\\1'>\\&</a>")

  # update chapter links to include book
  html.gsub! /chapter-/, "#{book_slug}-chapter-"

  # move footnotes to inline notes with *
  footnotes = html[/<p>-----.*/s].scan(/<p><sup>\[(\w+)\]<\/sup>(.*?)<\/p>/)
  html[/<p>-----.*/s] = '</div>'
  html.gsub!(/<sup>\[\w+\]/) do |m|
    "<sup title='#{ footnotes.assoc(m[/\[(\w+)\]/, 1]).last }'>*"
  end

  # remove excess brackets
  html.gsub! /\[(\w+)\]/, "\\1"

  # add extra markup for jquery mobile
  html = <<-END
    <div data-role="page" id="book-#{book_slug}" class="book-page">
      <div data-role="header">
        <h1>#{book}</h1>
        <a href="#contents" data-icon="back" data-transition="slide" data-direction="reverse">Contents</a>
      </div>
      <div data-role="content">
        #{html}
      </div>
    </div>
  END

  print "writing..."
  File.open(fn, "w") {|f| f.write html }
  puts "done."
end; nil



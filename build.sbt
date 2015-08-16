name := "geohash-debug-console"
description := "Web-based debug console to poke around geohash and related things"

version := "0.1.0-SNAPSHOT"

scalaVersion := "2.11.7"

libraryDependencies ++= Seq(
  "net.databinder" %% "unfiltered-directives" % "0.8.4",
  "net.databinder" %% "unfiltered-filter" % "0.8.4",
  "net.databinder" %% "unfiltered-jetty" % "0.8.4",
  "net.databinder" %% "unfiltered-json4s" % "0.8.4",
  "ch.hsr" % "geohash" % "1.1.0"
)

resolvers ++= Seq(
  "java m2" at "http://download.java.net/maven/2"
)

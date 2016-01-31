name := "geohash-debug-console"
description := "Web-based debug console to poke around geohash and related things"

version := "0.1.0"

scalaVersion := "2.11.7"

mainClass in Compile := Some("mismatch.geohash.console.Server")
assemblyJarName in assembly := s"${name.value}-dist.jar"

libraryDependencies ++= Seq(
  "net.databinder" %% "unfiltered-directives" % "0.8.4",
  "net.databinder" %% "unfiltered-filter" % "0.8.4",
  "net.databinder" %% "unfiltered-jetty" % "0.8.4",
  "net.databinder" %% "unfiltered-json4s" % "0.8.4",
  "net.databinder" %% "unfiltered-scalatest" % "0.8.4" % "test",
  "ch.hsr" % "geohash" % "1.1.0"
)

resolvers ++= Seq(
  "java m2" at "http://download.java.net/maven/2"
)

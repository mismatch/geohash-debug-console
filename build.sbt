name := "geohash-debug-console"
description := "Web-based debug console to poke around geohash and related things"

version := "0.1.1-SNAPSHOT"

scalaVersion := "2.13.8"

mainClass in Compile := Some("mismatch.geohash.console.Server")
assemblyJarName in assembly := s"${name.value}-dist.jar"

libraryDependencies ++= Seq(
  "ws.unfiltered" %% "unfiltered-directives" % "0.10.4",
  "ws.unfiltered" %% "unfiltered-filter" % "0.10.4",
  "ws.unfiltered" %% "unfiltered-jetty" % "0.10.4",
  "ws.unfiltered" %% "unfiltered-json4s" % "0.10.4",
  "ws.unfiltered" %% "unfiltered-scalatest" % "0.10.4" % "test",
  "ch.hsr" % "geohash" % "1.4.0"
)

resolvers ++= Seq(
  "java m2" at "http://download.java.net/maven/2"
)

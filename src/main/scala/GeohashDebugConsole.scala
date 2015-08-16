package mismatch.geohash.console

import unfiltered.request._
import unfiltered.response._
import unfiltered.directives._, Directives._
import unfiltered.filter.Plan

import org.json4s.JsonDSL._

import ch.hsr.geohash.GeoHash

class GeohashDebugConsole extends Plan {

  def geohash(lat: Double, lng: Double, bits: Int) = GeoHash.withBitPrecision(lat, lng, bits).toBinaryString

  def intent = Directive.Intent {
    case GET(Path(Seg("hashes" :: geom :: Nil))) => {
      case class BadParam(msg: String) extends ResponseJoiner(msg)(msgs =>
          BadRequest ~> ResponseString(msgs.mkString("", "\n", "\n")))


      def incorrectCoordinate(coordName: String)(paramName: String, paramValue: Double) = 
        BadParam(s"$paramValue is not correct value of $coordName")
      def isInRange(left: Double, right: Double)(value: Double) = (left <= value && value <= right)
      val latInterpreter = data.Conditional[Double](isInRange(-90.0, 90.0)).fail(incorrectCoordinate("latitude"))
      val lngInterpreter = data.Conditional[Double](isInRange(-180.0, 180.0)).fail(incorrectCoordinate("longitude"))
      val bitsInterpreter = data.Conditional[Int](b => (1 to 64) contains b).fail(
        (_, v) => BadParam(s"$v is out of bits range [1, 64]"))

      implicit val doubleValue = data.as.String ~> data.as.Double
      implicit val intValue = data.as.String ~> data.as.Int
      implicit def required[T] = data.Requiring[T].fail(name =>
          BadParam(s"'$name' is required")
      )
    
      geom match {
        case "point" => 
          for {
            (lat & lng & bits) <- 
              (latInterpreter ~> required named "lat") &
              (lngInterpreter ~> required named "lng") &
              (bitsInterpreter ~> required named "bits")
          } yield Json(("geohash" -> geohash(lat, lng, bits)))
        case _ => error(ResponseString(s"'$geom' is not supported")) 
      }
    }
  }
}

object Server {
  def main(args: Array[String]) {
    unfiltered.jetty.Server.http(8080).plan(new GeohashDebugConsole).run()
  }
}

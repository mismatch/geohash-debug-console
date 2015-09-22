package mismatch.geohash.console

import org.scalatest.matchers.ShouldMatchers
import org.scalatest.{GivenWhenThen, FeatureSpec}
import unfiltered.scalatest.Hosted
import unfiltered.scalatest.jetty.Served
import org.apache.http.util.EntityUtils

class GeohashDebugConsoleTest extends FeatureSpec with Served with Hosted with GivenWhenThen with ShouldMatchers {
  import dispatch.classic._

  override val port = 8080

  def setup = {    
    _.filter(new GeohashDebugConsole)
  }

  feature("rest service") {
    val http = new Http

    scenario("should validate coordinates") {
      given("invalid latitude and longitude parameters")
        val srvUrl = url("http://localhost:8080/hashes/point?bits=7&lat=96.333&lng=211.336")
      when("request has been made")
        val (status, body) = http.x(srvUrl) {
            case (code, _, Some(body)) => (code, EntityUtils.toString(body))
        }
      then("status is Bad Request")
        status should be(400)
      and("""body includes "is not correct value of latitude" """)
        body should include("is not correct value of latitude")
      and ("""body includes "is not correct value of longitude" """)
        body should include("is not correct value of longitude")
    }

    scenario("should validate number of bits") {
      given("invalid number of bits")
        val srvUrl = url("http://localhost:8080/hashes/point?bits=77&lat=36.333&lng=11.336")
      when("request has been made")
        val (status, body) = http.x(srvUrl) {
            case (code, _, Some(body)) => (code, EntityUtils.toString(body))
        }
      then("status is Bad Request")
        status should be(400)
      and("""body includes "is out of bits range" """)
        body should include("is out of bits range")
    }
  }
}

package mismatch.geohash.console

import org.scalatest.{Matchers, GivenWhenThen, FeatureSpec}
import unfiltered.scalatest.Hosted
import unfiltered.scalatest.jetty.Served
import okhttp3._

class GeohashDebugConsoleTest extends FeatureSpec with Served with Hosted with GivenWhenThen with Matchers {

  override val port = 8080

  def setup = {    
    _.plan(new GeohashDebugConsole)
  }

  feature("rest service") {
    val http = new OkHttpClient()

    scenario("should validate coordinates") {
      Given("invalid latitude and longitude parameters")
        val request = new Request.Builder()
          .url("http://localhost:8080/hashes/point?bits=7&lat=96.333&lng=211.336")
          .build()
      When("request has been made")
        val response = http.newCall(request).execute()
        val status = response.code
        val body = response.body().string()
      Then("status is Bad Request")
        status should be(400)
      And("""body includes "is not correct value of latitude" """)
        body should include("is not correct value of latitude")
      And ("""body includes "is not correct value of longitude" """)
        body should include("is not correct value of longitude")
    }

    scenario("should validate number of bits") {
      Given("invalid number of bits")
        val request = new Request.Builder()
          .url("http://localhost:8080/hashes/point?bits=77&lat=36.333&lng=11.336")
          .build()
      When("request has been made")
        val response = http.newCall(request).execute()        
      Then("status is Bad Request")
        response.code should be(400)
      And("""body includes "is out of bits range" """)
        response.body().string() should include("is out of bits range")
    }
  }
}
